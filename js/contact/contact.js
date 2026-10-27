const consultationForm = document.querySelector("#consultation-form");

if (consultationForm) {
    consultationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const whatsappNumber = "254708199397";

        const fullName = document.querySelector("#full-name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const phone = document.querySelector("#phone").value.trim();
        const projectType = document.querySelector("#project-type").value;
        const siteLocation = document.querySelector("#location").value.trim();
        const message = document.querySelector("#message").value.trim();
        const consent = document.querySelector("#nda-consent").checked;

        if (!fullName || !email || !phone || !projectType || !siteLocation || !message) {
            alert("Please complete all required fields.");
            return;
        }

        const phonePattern = /^(?:\+254|254|0)?[17]\d{8}$/;
        if (!phonePattern.test(phone.replace(/\s+/g, ""))) {
            alert("Please enter a valid Kenyan phone number.");
            return;
        }

        if (message.length < 10) {
            alert("Please provide more details about your project.");
            return;
        }

        if (message.length > 1000) {
            alert("Please keep your description under 1000 characters.");
            return;
        }

        if (!consent) {
            alert("Please agree to share your enquiry through WhatsApp.");
            return;
        }

        const whatsappMessage = `
*WHITE EAGLE CONSTRUCTION*
*NEW PROJECT ENQUIRY*

*Client Name:* ${fullName}
*Email:* ${email}
*Phone:* ${phone}

*Project Type:* ${projectType}
*Site Location:* ${siteLocation}

*Project Description:*
${message}

_Submitted through the White Eagle Construction website._
    `.trim();

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        // Open WhatsApp link
        const newTab = window.open(whatsappURL, "_blank");
        if (newTab) {
            newTab.opener = null;
        } else {
            window.location.href = whatsappURL;
        }

        
        consultationForm.reset();
    });
}