# Smart Packaging Project Documentation

## 1. Introduction

The Smart Packaging Project is an intelligent packaging design system built to reduce guesswork in product packaging. Instead of manually measuring a product, selecting a box style through trial and error, and then preparing a dieline separately, this project combines computer vision, AI-assisted analysis, and packaging design tools into one connected workflow. The platform allows a user to capture or upload product images, estimate the product dimensions using a known reference object, review the detected measurements, receive packaging guidance, choose a suitable FEFCO box structure, and generate the packaging layout for production planning.

In simple terms, this project is about converting product images into packaging-ready information. It takes a product that needs to be packed, identifies the product from top and side views, calculates physical dimensions, stores the project for future access, and helps the user move toward an optimized corrugated packaging solution.

This is not only a design tool. It is a workflow system. It manages users, stores projects, supports mobile capture, processes product images, computes dimensions, suggests packaging types, and visualizes dielines. The goal is to make packaging design faster, more accurate, and easier to understand for students, designers, packaging engineers, and businesses.

## 2. Problem Statement

Traditional packaging selection is often slow, manual, and inefficient. In many cases, a user must first measure the product with physical tools, then compare standard box types, then decide the internal size, and finally create or request a dieline for manufacturing. This manual process creates several problems:

- It consumes time, especially when many products must be evaluated.
- It depends heavily on human measurement accuracy.
- It may lead to poor box selection, wasted material, and higher cost.
- It creates friction between product analysis, packaging recommendation, and final design output.
- It is difficult for non-experts to understand which box style should be chosen and why.

The Smart Packaging Project solves this by creating a structured digital pipeline. It uses reference-based image measurement to estimate the product size, stores the packaging project in a database, allows the user to validate results visually, and then links those dimensions to standard FEFCO box templates. This reduces manual effort and gives the user a clearer decision path from product image to packaging concept.

## 3. Main Objective of the Project

The primary objective of this project is to automate the early stages of packaging design by using AI and computer vision. The system aims to:

- Detect the product and a reference object from images.
- Convert image measurements into real-world millimeter values.
- Determine the product length, width, and height using top and side views.
- Save the work as a reusable packaging project.
- Help the user select or receive recommendations for a FEFCO box type.
- Generate dieline-based packaging visuals for further design and production use.

The project therefore acts as a bridge between product inspection and packaging generation.

## 4. Technologies Used

The project is built as a multi-service system with three major technical layers:

### Frontend

- React with Vite for the user interface
- React Router for navigation
- Redux Toolkit and Redux Persist for state management
- Tailwind-style utility classes for UI styling
- Socket.IO client for real-time mobile-to-desktop communication

### Main Backend

- Node.js with Express
- MongoDB with Mongoose
- Cookie-based authentication
- Google OAuth and email OTP authentication
- Cloudinary for image storage
- Socket.IO for session communication

### AI and Computer Vision Backend

- FastAPI
- OpenCV and NumPy
- Ultralytics YOLO model for object detection
- Gemini-based AI analysis for product understanding and FEFCO recommendation

## 5. High-Level System Architecture

The project operates through three connected services:

1. The React frontend handles user interaction, project creation, image upload, review screens, template visualization, and navigation.
2. The Express backend manages authentication, project records, image storage, saved dimensions, template choices, and project lifecycle state.
3. The FastAPI backend performs object detection and dimension-related image analysis using a trained model.

The frontend communicates with both backends. The Express backend is the main application server, while the FastAPI service is a specialized image-processing engine. The project also uses Cloudinary to store the uploaded top and side product images.

## 6. Core Workflow of the Project

The complete flow of the project can be understood as a sequence of stages.

### Step 1: User Authentication

The user first signs up or logs in. The system supports:

- Email and password registration with OTP verification
- Google sign-in

Once the user is authenticated, protected routes become accessible. This ensures that project data belongs to the logged-in user and remains organized per account.

### Step 2: Project Creation

When the user enters the upload workflow, the frontend first creates a new project through the backend. A unique session ID is generated and stored. This session ID is important because it becomes the identifier for the entire packaging workflow.

At this stage, the project exists in the database as a draft. It will later be updated with uploaded images, measured dimensions, recommendation data, and selected box template.

### Step 3: Image Input

The system requires two images of the same product:

- Top view image
- Side view image

The user can provide these images in two ways:

- Desktop upload from the local system
- Mobile-guided capture using a live session link

In both cases, the user also selects a reference object. The current reference options include:

- Coin
- ATM card
- 2x2 box

The reference object is critical because it gives the system a known real-world size. Without it, the system cannot convert pixel distances into millimeters.

### Step 4: Image Processing and Detection

Each uploaded image is sent to the computer vision backend. The YOLO-based detection model identifies:

- The reference object
- The product object

For each image, the system returns bounding box coordinates. The backend handles multiple conditions:

- Both reference and product are detected
- Reference is missing
- Product is missing
- Nothing is detected

This makes the workflow more robust because the frontend can respond with useful feedback instead of failing silently.

### Step 5: Save Detection Results

After successful detection:

- The top view detection is stored in the project as `topView`
- The side view detection is stored in the project as `sideView`

Each view stores:

- Product bounding boxes
- Reference object bounding boxes

At this point, the project status moves forward because meaningful measurement data has been captured.

### Step 6: Upload Original Images

In addition to processing the images for detection, the original top and side images are uploaded to Cloudinary through the Express backend. The backend then stores the resulting image URLs in the project record. This allows the user to reopen the project later and review the same images again.

So the project stores both:

- The image URLs
- The measurement/detection metadata

### Step 7: Review Page and Dimension Validation

The review page is one of the most important parts of the application. Here, the user can inspect the detected top and side views. The interface displays bounding boxes so that the product and reference object can be reviewed visually.

The system then calculates product dimensions using the following logic:

- First, it measures the reference object in pixels.
- Then it uses the real-world size of that reference object to calculate a millimeter-per-pixel ratio.
- Next, it applies this ratio to the product bounding box in the top image to estimate two dimensions.
- It applies the same method to the side image.
- Finally, it compares top and side measurements to infer the third dimension, which becomes the product height.

The result is a 3D dimension estimate:

- Length
- Width
- Height

These values are then stored in Redux for frontend continuity and also saved back to the project in the backend.

## 7. How Measurement Works

The project follows a reference-based scaling method. This is the core technical idea behind the measurement system.

For example, if a coin is selected, the system assumes a fixed known diameter in millimeters. If the detected coin spans a certain number of pixels in the image, then the system computes:

`millimeters per pixel = real reference size / reference size in pixels`

Once this scale is known, the product bounding box can be converted from pixels to millimeters. The same method is used for an ATM card by considering the correct side depending on orientation.

This approach is practical because it avoids requiring a depth sensor or a physical measuring device. It turns ordinary photos into approximate packaging dimensions.

## 8. AI-Based Packaging Recommendation

After dimensions and image URLs are available, the project can send both product images and the calculated dimensions to an AI recommendation service. This service analyzes:

- What the product likely is
- How fragile it appears to be
- An estimated product weight
- The most suitable FEFCO box style from a predefined list

This recommendation is important because packaging is not only about size. It is also about protection, material usage, and structural suitability. The AI module helps the user move from raw dimensions to a packaging decision.

The AI response typically contains:

- Product name
- Fragility level
- Estimated weight
- Recommended FEFCO box

This information is then saved so the project has both numerical measurement data and contextual packaging guidance.

## 9. Dieline and Template Generation

Once the product dimensions are known, the user reaches the packaging design stage. The system supports standard FEFCO-style dieline templates such as:

- FEFCO 0201
- FEFCO 0203
- FEFCO 0301
- FEFCO 0401
- FEFCO 0427

The frontend uses a template registry to map these codes to specific dieline components. Each template can be visualized and adjusted using dimensions like length, width, height, flap size, glue flap, and board thickness.

This stage helps the user understand how the physical package structure will look before manufacturing. The system also includes 2D dieline viewing and 3D preview functionality, making the packaging concept easier to validate visually.

## 10. Project Dashboard and Persistence

Every project is stored in MongoDB. The dashboard displays saved projects with:

- Project name
- Status
- Reference object used
- Measured dimensions
- Last updated time

The main statuses used in the project lifecycle are:

- `draft`
- `uploaded`
- `measured`
- `configured`
- `completed`

This lifecycle is useful because it shows how far a packaging design has progressed. A user can return to a saved project, continue measuring, refine the chosen template, or prepare a report later.

## 11. Mobile Capture Support

One of the useful features of this project is mobile-assisted capture. Some products are easier to photograph with a phone than with a desktop webcam or manual transfer process. For that reason, the system includes a mobile capture flow.

The mobile workflow includes:

- Session connection
- Reference object selection
- Top view capture
- Top view crop/review
- Side view capture
- Side view crop/review
- Final upload

After upload, Socket.IO is used to notify the connected session that mobile upload is complete. This improves usability because the desktop workflow can continue once the mobile image capture has finished.

## 12. Data Given to the System

The main inputs of the system are:

- User account details for authentication
- A unique project session
- Top view image of the product
- Side view image of the product
- Selected reference object
- User-selected or AI-recommended FEFCO template
- Optional packaging configuration choices such as material and fragility

These inputs allow the system to build a complete packaging project from scratch.

## 13. Data Produced by the System

The main outputs generated by the project are:

- Uploaded product image URLs
- Bounding box coordinates for product and reference object
- Estimated product dimensions in millimeters
- AI-based product and packaging recommendation
- Selected FEFCO template information
- 2D and 3D dieline visualization
- Stored project history for later reuse

So the system does not produce only a single result. It produces a complete chain of packaging information.

## 14. Why This Project Is Valuable

This project is valuable because it solves a real industrial and design problem with a practical digital workflow. It helps users:

- Save time in packaging analysis
- Reduce manual measurement effort
- Improve consistency in box selection
- Visualize packaging earlier in the design cycle
- Organize packaging work in project form instead of disconnected files

It is especially useful in environments where many products need quick packaging estimation or where users do not have expert packaging knowledge.

## 15. Conclusion

The Smart Packaging Project is an end-to-end intelligent packaging workflow system. It begins with product image acquisition and ends with packaging configuration and dieline visualization. The project combines authentication, cloud image storage, object detection, real-world dimension estimation, AI recommendation, and FEFCO-based packaging design in one platform.

The main strength of the project is its flow. The user is not left to do disconnected tasks manually. Instead, the system guides them through a defined sequence: create project, upload or capture images, detect product and reference object, calculate dimensions, review results, receive packaging guidance, choose a structural template, and continue toward report or production preparation.

In short, this project is about transforming raw product images into structured packaging intelligence. It solves the problem of manual, fragmented, and inefficient packaging design by creating a smarter and more connected process.
