// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import BASE_URL from "../api";
// import "./RegisterPlayer.css";

// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// function RegisterPlayer() {
//     const { leagueId } = useParams();
//     const navigate = useNavigate();
//     const receiptRef = useRef();
//     const checkedRef = useRef(false);

//     const [league, setLeague] = useState(null);
//     const [photo, setPhoto] = useState(null);
//     const [preview, setPreview] = useState(null);
//     const [showReceipt, setShowReceipt] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const [formData, setFormData] = useState({
//         name: "",
//         village: "",
//         phone: "",
//         role: "",
//         tshirtSize: "",
//         pantSize: "",
//     });

//     // ================= FETCH LEAGUE =================
//     useEffect(() => {
//         fetch(`${BASE_URL}/api/leagues`)
//             .then((res) => res.json())
//             .then((data) => {
//                 const found = data.find((l) => l._id === leagueId);
//                 setLeague(found || null);
//             })
//             .catch(() => alert("Failed to load league"));
//     }, [leagueId]);

//     // ================= CHECK EXPIRY =================
//     useEffect(() => {
//         if (league && !checkedRef.current) {
//             checkedRef.current = true;

//             const expired = new Date() > new Date(league.lastDate);

//             if (expired) {
//                 alert("Registration Closed ❌");
//                 navigate("/view-leagues");
//             }
//         }
//     }, [league, navigate]);

//     // ================= INPUT =================
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     // ================= IMAGE PREVIEW =================
//     const handlePhotoChange = (e) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         if (preview) URL.revokeObjectURL(preview);

//         const objectUrl = URL.createObjectURL(file);
//         setPhoto(file);
//         setPreview(objectUrl);
//     };

//     useEffect(() => {
//         return () => {
//             if (preview) URL.revokeObjectURL(preview);
//         };
//     }, [preview]);

//     // ================= SAVE PLAYER =================
//     const handleSubmit = async () => {
//         try {
//             const formDataToSend = new FormData();

//             Object.entries(formData).forEach(([key, value]) => {
//                 formDataToSend.append(key === "phone" ? "mobile" : key, value);
//             });

//             formDataToSend.append("leagueId", leagueId);

//             if (photo) formDataToSend.append("photo", photo);

//             const saveRes = await fetch(`${BASE_URL}/api/register`, {
//                 method: "POST",
//                 body: formDataToSend,
//             });

//             const saveData = await saveRes.json();

//             if (!saveRes.ok) {
//                 throw new Error(saveData.msg || "Registration failed");
//             }

//             setShowReceipt(true);
//         } catch (err) {
//             console.error(err);
//             alert("Registration failed ❌");
//         }
//     };

//     // ================= PAYMENT =================
//     const handlePayment = async (e) => {
//         e.preventDefault();

//         // ✅ Required validation
//         if (
//             !formData.name ||
//             !formData.phone ||
//             !formData.role ||
//             !formData.tshirtSize ||
//             !formData.pantSize
//         ) {
//             return alert("Please fill all required fields");
//         }

//         // ✅ Mobile validation
//         if (formData.phone.length !== 10) {
//             return alert("Enter valid 10 digit mobile number");
//         }

//         // ✅ League check
//         if (!league) {
//             return alert("Loading league...");
//         }

//         try {

//             // ✅ Create Razorpay Order
//             const res = await fetch(`${BASE_URL}/api/create-order`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     amount: Number(league.entryFee),
//                 }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.error || "Order creation failed");
//             }

//             // ✅ Razorpay Options
//             const options = {
//                 key: import.meta.env.VITE_RAZORPAY_KEY,
//                 amount: data.amount,
//                 currency: "INR",
//                 name: "BatBallVc",
//                 description: `Registration Fee ₹${league.entryFee}`,
//                 order_id: data.id,

//                 handler: async function (response) {

//                     try {

//                         // ✅ VERIFY PAYMENT
//                         const verifyRes = await fetch(
//                             `${BASE_URL}/api/verify-payment`,
//                             {
//                                 method: "POST",
//                                 headers: {
//                                     "Content-Type": "application/json",
//                                 },
//                                 body: JSON.stringify(response),
//                             }
//                         );

//                         const verifyData = await verifyRes.json();

//                         // ❌ Verification Failed
//                         if (!verifyData.success) {
//                             alert("Payment verification failed ❌");
//                             return;
//                         }

//                         // ✅ SAVE PLAYER
//                         await handleSubmit();

//                         // ✅ SUCCESS MESSAGE
//                         alert("Registration Successful ✅");

//                     } catch (err) {

//                         console.error(err);

//                         alert(
//                             "Payment successful but registration failed. Contact admin."
//                         );
//                     }
//                 },

//                 // ✅ Autofill
//                 prefill: {
//                     name: formData.name,
//                     contact: formData.phone,
//                 },

//                 // ✅ Theme
//                 theme: {
//                     color: "#3399cc",
//                 },
//             };

//             // ✅ Open Razorpay
//             const rzp = new window.Razorpay(options);

//             // ❌ Payment Failed
//             rzp.on("payment.failed", function (response) {

//                 console.error(response);

//                 alert("Payment Failed ❌");
//             });

//             rzp.open();

//         } catch (err) {

//             console.error(err);

//             alert("Payment failed ❌");
//         }
//     };

//     // ================= PDF =================
//     const downloadPDF = async () => {
//         const canvas = await html2canvas(receiptRef.current);
//         const imgData = canvas.toDataURL("image/png");

//         const pdf = new jsPDF();
//         pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
//         pdf.save("Receipt.pdf");
//     };

//     // ================= LOADING =================
//     if (!league) {
//         return <h3 style={{ textAlign: "center" }}>Loading league...</h3>;
//     }

//     // ================= RECEIPT =================
//     if (showReceipt) {
//         return (
//             <div className="view-container">
//                 <div className="form-wrapper">
//                     <div ref={receiptRef} className="form-card">
//                         <h2>Payment Successful ✅</h2>
//                         <h4>{league.name}</h4>

//                         <p>Name: {formData.name}</p>
//                         <p>Village: {formData.village}</p>
//                         <p>Mobile: {formData.phone}</p>
//                         <p>Role: {formData.role}</p>

//                         <h3>₹{league.entryFee}</h3>
//                     </div>
//                 </div>

//                 <button onClick={downloadPDF}>Download PDF</button>
//             </div>
//         );
//     }

//     // ================= FORM =================
//     return (
//         <div className="view-container">
//             <div className="form-wrapper">
//                 <div className="form-card">

//                     <h2>🏏 Player Registration</h2>
//                     <h4>{league.name}</h4>
//                     <h3>Payment झाल्यानंतर Download Receipt येईपर्यंत थोडा वेळ प्रतीक्षा करा. तरच Registration Complete होईल.</h3>
//                     <p>Entry Fee: ₹{league.entryFee}</p>
//                     <img
//                         src={preview || "/default.jpg"}
//                         alt="preview"
//                         style={{ width: 120, height: 120 }}
//                     />

//                     <input name="name" placeholder="Name" onChange={handleChange} required />
//                     <input name="village" placeholder="Village" onChange={handleChange} required />
//                     {/* <input name="phone" placeholder="Mobile" onChange={handleChange} required /> */}
//                     <input
//                         name="phone"
//                         placeholder="Mobile Number"
//                         onChange={handleChange}
//                         maxLength={10}
//                         pattern="[0-9]{10}"
//                         required
//                     />

//                     <select name="role" onChange={handleChange} required>
//                         <option value="">Select Role</option>
//                         <option>Batsman</option>
//                         <option>Bowler</option>
//                         <option>All Rounder</option>
//                     </select>

//                     <input name="tshirtSize" placeholder="T-Shirt Size" onChange={handleChange} required />
//                     <input name="pantSize" placeholder="Pant Size" onChange={handleChange} required />
//                     <br />
//                     <h3>Player Photo</h3>
//                     <input type="file" onChange={handlePhotoChange} required />

//                     <button onClick={handlePayment}>Pay & Register</button>

//                 </div>
//             </div>
//         </div>
//     );
// }

// export default RegisterPlayer;




// =======================================================


import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../api";
import "./RegisterPlayer.css";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function RegisterPlayer() {

    const { leagueId } = useParams();
    const navigate = useNavigate();

    const receiptRef = useRef();
    const checkedRef = useRef(false);

    const [league, setLeague] = useState(null);

    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);

    const [showReceipt, setShowReceipt] = useState(false);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        village: "",
        phone: "",
        role: "",
        tshirtSize: "",
        pantSize: "",
    });

    // ================= FETCH LEAGUE =================
    useEffect(() => {

        fetch(`${BASE_URL}/api/leagues`)
            .then((res) => res.json())
            .then((data) => {

                const found = data.find(
                    (l) => l._id === leagueId
                );

                setLeague(found);
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to load league ❌");
            });

    }, [leagueId]);

    // ================= CHECK LAST DATE =================
    useEffect(() => {

        if (league && !checkedRef.current) {

            checkedRef.current = true;

            const expired =
                new Date() > new Date(league.lastDate);

            if (expired) {

                alert("Registration Closed ❌");

                navigate("/view-leagues");
            }
        }

    }, [league, navigate]);

    // ================= INPUT CHANGE =================
    const handleChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // ================= IMAGE CHANGE =================
    const handlePhotoChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        // cleanup old preview
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        const objectUrl = URL.createObjectURL(file);

        setPhoto(file);
        setPreview(objectUrl);
    };

    // ================= CLEANUP =================
    useEffect(() => {

        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };

    }, [preview]);

    // ================= SAVE PLAYER =================
    // const handleSubmit = async () => {

    //     try {

    //         const formDataToSend = new FormData();

    //         formDataToSend.append("name", formData.name);
    //         formDataToSend.append("role", formData.role);
    //         formDataToSend.append("village", formData.village);

    //         // IMPORTANT
    //         formDataToSend.append(
    //             "mobile",
    //             formData.phone
    //         );

    //         formDataToSend.append(
    //             "leagueId",
    //             leagueId
    //         );

    //         formDataToSend.append(
    //             "tshirtSize",
    //             formData.tshirtSize
    //         );

    //         formDataToSend.append(
    //             "pantSize",
    //             formData.pantSize
    //         );

    //         if (photo) {
    //             formDataToSend.append("photo", photo);
    //         }

    //         const saveRes = await fetch(
    //             `${BASE_URL}/api/register`,
    //             {
    //                 method: "POST",
    //                 body: formDataToSend,
    //             }
    //         );

    //         const saveData = await saveRes.json();

    //         if (!saveRes.ok) {
    //             throw new Error(
    //                 saveData.msg || "Registration failed"
    //             );
    //         }

    //         setShowReceipt(true);

    //     } catch (err) {

    //         console.error(err);

    //         throw err;
    //     }
    // };

    const handleSubmit = async () => {

        try {

            const formDataToSend = new FormData();

            // ✅ BASIC INFO
            formDataToSend.append(
                "name",
                formData.name || ""
            );

            formDataToSend.append(
                "village",
                formData.village || ""
            );

            formDataToSend.append(
                "role",
                formData.role || ""
            );

            // ✅ IMPORTANT FIX
            formDataToSend.append(
                "mobile",
                formData.phone || ""
            );

            // ✅ IMPORTANT FIX
            formDataToSend.append(
                "tshirtSize",
                formData.tshirtSize || ""
            );

            // ✅ IMPORTANT FIX
            formDataToSend.append(
                "pantSize",
                formData.pantSize || ""
            );

            // ✅ LEAGUE
            formDataToSend.append(
                "leagueId",
                leagueId
            );

            // ✅ PHOTO
            if (photo) {
                formDataToSend.append(
                    "photo",
                    photo
                );
            }

            // ✅ API CALL
            const res = await fetch(
                `${BASE_URL}/api/register`,
                {
                    method: "POST",
                    body: formDataToSend,
                }
            );

            const data = await res.json();

            console.log("Saved Player:", data);

            if (!res.ok) {

                alert("Registration failed ❌");

                return;
            }

            setShowReceipt(true);

        } catch (err) {

            console.error(err);

            alert("Registration failed ❌");
        }
    };
    // ================= PAYMENT =================
    const handlePayment = async (e) => {

        e.preventDefault();

        // prevent double click
        if (loading) return;

        // validation
        if (
            !formData.name ||
            !formData.phone ||
            !formData.role ||
            !formData.tshirtSize ||
            !formData.pantSize
        ) {
            return alert(
                "Please fill all required fields"
            );
        }

        // mobile validation
        if (formData.phone.length !== 10) {
            return alert(
                "Enter valid 10 digit mobile number"
            );
        }

        // league check
        if (!league) {
            return alert("Loading league...");
        }

        setLoading(true);

        try {

            // ================= CREATE ORDER =================
            const res = await fetch(
                `${BASE_URL}/api/create-order`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: Number(league.entryFee),
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {

                setLoading(false);

                throw new Error(
                    data.error || "Order creation failed"
                );
            }

            // ================= RAZORPAY =================
            const options = {

                key: import.meta.env.VITE_RAZORPAY_KEY,

                amount: data.amount,

                currency: "INR",

                name: "BatBallVc",

                description:
                    `Registration Fee ₹${league.entryFee}`,

                order_id: data.id,

                handler: async function (response) {

                    try {

                        // ================= VERIFY PAYMENT =================
                        const verifyRes = await fetch(
                            `${BASE_URL}/api/verify-payment`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/json",
                                },
                                body: JSON.stringify(response),
                            }
                        );

                        const verifyData =
                            await verifyRes.json();

                        // verification failed
                        if (!verifyData.success) {

                            setLoading(false);

                            alert(
                                "Payment verification failed ❌"
                            );

                            return;
                        }

                        // ================= SAVE PLAYER =================
                        await handleSubmit();

                        setLoading(false);

                        alert(
                            "Registration Successful ✅"
                        );

                    } catch (err) {

                        console.error(err);

                        setLoading(false);

                        alert(
                            "Payment successful but registration failed. Contact admin."
                        );
                    }
                },

                // ================= PREFILL =================
                prefill: {
                    name: formData.name,
                    contact: formData.phone,
                },

                // ================= THEME =================
                theme: {
                    color: "#3399cc",
                },
            };

            // ================= OPEN PAYMENT =================
            const rzp = new window.Razorpay(options);

            // payment failed
            rzp.on(
                "payment.failed",
                function (response) {

                    console.error(response);

                    setLoading(false);

                    alert("Payment Failed ❌");
                }
            );

            rzp.open();

        } catch (err) {

            console.error(err);

            setLoading(false);

            alert("Payment failed ❌");
        }
    };

    // ================= DOWNLOAD PDF =================
    const downloadPDF = async () => {

        try {

            const canvas = await html2canvas(
                receiptRef.current,
                {
                    scale: 2,
                }
            );

            const imgData =
                canvas.toDataURL("image/png");

            const pdf = new jsPDF();

            pdf.addImage(
                imgData,
                "PNG",
                10,
                10,
                180,
                0
            );

            pdf.save("Receipt.pdf");

        } catch (err) {

            console.error(err);

            alert("PDF download failed ❌");
        }
    };

    // ================= RECEIPT =================
    if (showReceipt) {

        return (

            <div className="view-container">

                <div className="form-wrapper">

                    <div
                        ref={receiptRef}
                        className="form-card"
                        style={{
                            background: "white",
                            color: "black",
                        }}
                    >

                        <h2 className="text-success text-center">
                            Payment Successful ✅
                        </h2>

                        <h4 className="text-center">
                            {league?.name}
                        </h4>

                        <hr />

                        <p>
                            <b>Name:</b> {formData.name}
                        </p>

                        <p>
                            <b>Village:</b> {formData.village}
                        </p>

                        <p>
                            <b>Mobile:</b> {formData.phone}
                        </p>

                        <p>
                            <b>Role:</b> {formData.role}
                        </p>

                        <p>
                            <b>T-Shirt Size:</b>
                            {" "}
                            {formData.tshirtSize}
                        </p>

                        <p>
                            <b>Pant Size:</b>
                            {" "}
                            {formData.pantSize}
                        </p>

                        <hr />

                        <h3 className="text-center text-warning">
                            ₹{league?.entryFee}
                        </h3>

                        <p className="text-center">
                            {new Date().toLocaleString()}
                        </p>

                    </div>

                </div>

                <div className="text-center mt-3">

                    <button
                        className="league-btn"
                        onClick={downloadPDF}
                    >
                        Download PDF 📄
                    </button>

                </div>

            </div>
        );
    }

    // ================= FORM =================
    return (

        <div className="view-container">

            <div className="form-wrapper">

                <div className="form-card">

                    <h2 className="text-center mb-3">
                        🏏 Player Registration
                    </h2>

                    <h4 className="text-center">
                        {league?.name}
                    </h4>

                    <p className="text-center text-warning">
                        Entry Fee: ₹{league?.entryFee}
                    </p>

                    <p
                        style={{
                            color: "orange",
                            fontSize: "14px",
                            textAlign: "center",
                        }}
                    >
                        Payment झाल्यानंतर Receipt येईपर्यंत प्रतीक्षा करा.
                    </p>

                    <hr />

                    {/* IMAGE */}
                    <div className="text-center">

                        <img
                            src={preview || "/default.jpg"}
                            alt="preview"
                            className="player-image"
                            style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "10px",
                            }}
                        />

                    </div>

                    {/* NAME */}
                    <input
                        className="input-field"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    {/* VILLAGE */}
                    <input
                        className="input-field"
                        name="village"
                        placeholder="Village"
                        value={formData.village}
                        onChange={handleChange}
                        required
                    />

                    {/* MOBILE */}
                    <input
                        className="input-field"
                        name="phone"
                        placeholder="Mobile Number"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        required
                    />

                    {/* ROLE */}
                    <select
                        className="input-field"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Select Role
                        </option>

                        <option>
                            Batsman
                        </option>

                        <option>
                            Bowler
                        </option>

                        <option>
                            All Rounder
                        </option>

                    </select>

                    {/* TSHIRT */}
                    <input
                        className="input-field"
                        name="tshirtSize"
                        placeholder="T-Shirt Size"
                        value={formData.tshirtSize}
                        onChange={handleChange}
                        required
                    />

                    {/* PANT */}
                    <input
                        className="input-field"
                        name="pantSize"
                        placeholder="Pant Size"
                        value={formData.pantSize}
                        onChange={handleChange}
                        required
                    />
                    {/* PHOTO */}
                    <input
                        type="file"
                        className="input-field"
                        accept="image/*"
                        onChange={handlePhotoChange}
                    />

                    {/* BUTTON */}
                    <button
                        className="league-btn mt-2"
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : "Pay & Register"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default RegisterPlayer;