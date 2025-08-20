import Stripe from "stripe";
import Course from "../models/course.model.js";
import { CoursePurchased } from "../models/purchasedCourse.model.js";
import Lecture from "../models/lecture.model.js";
import User from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course Not Found",
      });
    }

    //Create a new course purchase record

    const newPurchase = new CoursePurchased({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    //Create a Stripe checkout session

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, //amount in paisa
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/course-progress/${courseId}`, //once payment succeeds
      cancel_url: `http://localhost:5173/course-details/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], //optionally resist allowed countries
      },
    });
    if (!session.url) {
      return res.status(400).json({
        success: false,
        message: "Error while creating session",
      });
    }

    //Save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, //return the Stripe checkout url
    });
  } catch (error) {
    console.error(error);
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  //Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      const purchased = await CoursePurchased.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchased) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchased.amount = session.amount_total / 100;
      }
      purchased.status = "completed";

      //Make all lectures visible by setting `isPreviewFree` true
      if (purchased.courseId && purchased.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchased.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchased.save();

      //Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchased.userId,
        { $addToSet: { enrolledCourses: purchased.courseId._id } },
        { new: true }
      );

      //Update course to add uer Id to enrolled enrolledStudents
      await Course.findByIdAndUpdate(
        purchased.courseId._id,
        { $addToSet: { enrolledStudents: purchased.userId } },
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};

export const getAllPurchasedCourses = async (_, res) => {
  try {
    const purchasedCourses = await CoursePurchased.find({
      status: "completed",
    }).populate("courseId");

    if (!purchasedCourses) {
      return res.status(404).json({
        purchasedCourses: [],
      });
    }
    res.status(200).json({
      success: true,
      data: purchasedCourses,
    });
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get specific course details with status
export const getCourseDetailWithStatus = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate({ path: "instructor" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchased.findOne({ userId, courseId });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({ course, purchased: !!purchased }); //true if purchased, false otherwise
  } catch (error) {
    console.error("Error fetching course detail:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
