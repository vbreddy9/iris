import React, { useState, useEffect } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import logo from "./assets/iris-1.webp";

const Banner = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    agreeTerms: false,
    ip: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get("https://api64.ipify.org?format=json")
      .then((response) => {
        setFormData((prev) => ({ ...prev, ip: response.data.ip }));
      })
      .catch(() => {
        setFormData((prev) => ({ ...prev, ip: "unknown" }));
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";

    // Validate mobile (minimum 10 digits)
    const onlyDigits = formData.mobile.replace(/\D/g, "");
    if (onlyDigits.length < 10)
      newErrors.mobile = "Mobile must be at least 10 digits";

    if (!formData.agreeTerms)
      newErrors.agreeTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://iris.get-details.com/home/send-email", // Match backend port here
        {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile.replace(/\D/g, ""), // Send digits only to backend
          ip: formData.ip,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(
        response.data.message ||
          "Your request was submitted successfully! We'll contact you soon."
      );

      // Reset except IP
      setFormData({
        name: "",
        email: "",
        mobile: "",
        agreeTerms: false,
        ip: formData.ip,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
      window.location.reload();
    } catch (error) {
      console.error("Error sending email:", error);
      alert(
        error.response?.data?.error ||
          "There was an error submitting your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6 lg:px-12 py-6"
      style={{ backgroundImage: `url(${logo})` }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative w-full max-w-6xl flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-6">
        <div className="p-4 md:p-6 lg:p-8 text-white max-w-md md:w-1/2 z-10 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold leading-snug mb-4">
            Discover Urban Living at Its Finest
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-4">
            Schedule your{" "}
            <span style={{ color: '#cb8904' }}>exclusive site visit</span> today at{" "}
            <span style={{ color: '#cb8904' }}><strong>Raidurgum, Gachibowli</strong></span> — Hyderabad’s most promising address for future-forward living.
          </p>
          <hr className="border-gray-500" />
        </div>

        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg z-10">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6">
            REQUEST CALLBACK TODAY!
          </h2>
          <form className="space-y-4" onSubmit={handleFormSubmit} noValidate>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name*"
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address*"
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            
            <PhoneInput
              country="in"
              value={formData.mobile}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, mobile: value }))
              }
              containerClass="w-full"
              inputClass="py-4 bg-transparent"
              inputProps={{
                name: "mobile",
                required: true,
              }}
              
              
            />
            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}

            <div className="flex items-start text-sm">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mr-2 mt-1"
                required
              />
              <span>
                I authorize Raghava Projects and its representatives to Call, SMS, Email or WhatsApp me. I also accept{" "}
                T&C {" "}and{" "} Privacy Policy                .
              </span>
            </div>
            {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}
            <button
              type="submit"
              className="w-full text-white p-3 rounded text-lg bg-[#cb8904] hover:bg-[#a77203] transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit your request"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Banner;
