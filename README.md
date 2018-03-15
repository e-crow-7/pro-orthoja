# Orthoja Project
Orthoja is a medical journaling application for orthopedic patients and doctors. The software suite provides interfaces for logging and obtaining information during an orthopedic process.

Patients use the software to access and log important information regarding their orthopedic surgery and to communicate with their doctor.

Doctors utilize the software by viewing and managing the data their patient's provide. The doctor uses this information for research, improvements, and making decisions. The information can be displayed broadly amongst all patients, or targeted on a specific patient.

## Logo
The logo is stored in a Photoshop file as a vector object. The logo is a combination of the characters "O", "j", and "a" (the abbreviation for Orthopedic Journaling Application). The logo is provided in several sizes required by web and phone application standards.

![Orthoja Logo XHDPI](./media/android-universal-icons/drawable-xhdpi.png "Orthoja Logo XHDPI")

## Products
There are three products that Orthoja uses to provide it's services.
* **Orthoja Phone Application**
    * The phone application provides patients with an interface to obtain and send important data to their doctor.
* **Orthoja Web Interface**
    * Doctors can login to their own accounts to view configure patient accounts and view informations about them.
* **Orthoja API Service**
    * RESTful API service for executing database actions and managing account sessions.
* **Orthoja HTTP Web Service**
    * Handles HTTP requests for the Orthoja website. 

## Communication Schema
Each project communicates using a single common JSON-based schema. If a message does not adhere to the schema, the message is rejected. There are two schemas: One for _requests_, and one for _responses_.

## About
* **Author:** Eric G. Crowell
* **Special Thanks:** Dr. D. Pili for commissioning and testing