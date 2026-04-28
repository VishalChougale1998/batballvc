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

//     const [formData, setFormData] = useState({
//         name: "",
//         village: "",
//         phone: "",
//         role: "",
//         tshirtSize: "",
//         pantSize: ""
//     });

//     // ================= FETCH LEAGUE =================
//     useEffect(() => {
//         fetch(`${BASE_URL}/api/leagues`)
//             .then((res) => res.json())
//             .then((data) => {
//                 const found = data.find((l) => l._id === leagueId);
//                 setLeague(found);
//             })
//             .catch(() => alert("Failed to load league"));
//     }, [leagueId]);

//     // ================= FIX EXPIRY LOOP =================
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
//             [e.target.name]: e.target.value
//         });
//     };

//     // ================= IMAGE PREVIEW (FIXED) =================
//     const handlePhotoChange = (e) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         // Cleanup old preview (VERY IMPORTANT)
//         if (preview) {
//             URL.revokeObjectURL(preview);
//         }

//         const objectUrl = URL.createObjectURL(file);

//         setPhoto(file);
//         setPreview(objectUrl);
//     };

//     // Cleanup on unmount (prevent memory leak)
//     useEffect(() => {
//         return () => {
//             if (preview) {
//                 URL.revokeObjectURL(preview);
//             }
//         };
//     }, [preview]);

//     // ================= SAVE PLAYER =================
//     const handleSubmit = async () => {
//         try {
//             const formDataToSend = new FormData();

//             formDataToSend.append("name", formData.name);
//             formDataToSend.append("role", formData.role);
//             formDataToSend.append("village", formData.village);
//             formDataToSend.append("mobile", formData.phone);
//             formDataToSend.append("leagueId", leagueId);
//             formDataToSend.append("tshirtSize", formData.tshirtSize);
//             formDataToSend.append("pantSize", formData.pantSize);

//             if (photo) {
//                 formDataToSend.append("photo", photo);
//             }

//             await fetch(`${BASE_URL}/api/register`, {
//                 method: "POST",
//                 body: formDataToSend
//             });

//             setShowReceipt(true);

//         } catch (err) {
//             console.error(err);
//             alert("Registration failed ❌");
//         }
//     };

//     // ================= PAYMENT =================
//     const handlePayment = async (e) => {
//         e.preventDefault();

//         if (!formData.name || !formData.phone || !formData.role) {
//             return alert("Please fill required fields");
//         }

//         if (!league) return alert("Loading...");

//         try {
//             const res = await fetch(`${BASE_URL}/api/payment/create-order`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ amount: league.entryFee })
//             });

//             const data = await res.json();

//             const options = {
//                 key: "rzp_live_SiqEGrq0TVRyuM",
//                 amount: data.amount,
//                 currency: "INR",
//                 name: "BatBallVc",
//                 description: `Registration ₹${league.entryFee}`,
//                 order_id: data.id,

//                 handler: async function () {
//                     await handleSubmit();
//                 },

//                 prefill: {
//                     name: formData.name,
//                     contact: formData.phone
//                 }
//             };

//             const rzp = new window.Razorpay(options);
//             rzp.open();

//         } catch (err) {
//             console.error(err);
//             alert("Payment failed ❌");
//         }
//     };

//     // ================= PDF =================
//     const downloadPDF = async () => {
//         try {
//             const canvas = await html2canvas(receiptRef.current, { scale: 2 });
//             const imgData = canvas.toDataURL("image/png");

//             const pdf = new jsPDF();
//             pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
//             pdf.save("Receipt.pdf");
//         } catch {
//             alert("PDF failed ❌");
//         }
//     };
//     console.log(league.entryFee);

//     // ================= RECEIPT =================
//     if (showReceipt) {
//         return (
//             <div className="view-container">
//                 <div className="form-wrapper">
//                     <div ref={receiptRef} className="form-card" style={{ background: "white", color: "black" }}>
//                         <h2 className="text-success text-center">Payment Successful ✅</h2>
//                         <h4 className="text-center">{league?.name}</h4>

//                         <hr />

//                         <p><b>Name:</b> {formData.name}</p>
//                         <p><b>Village:</b> {formData.village}</p>
//                         <p><b>Mobile:</b> {formData.phone}</p>
//                         <p><b>Role:</b> {formData.role}</p>

//                         <hr />

//                         <h3 className="text-center text-warning">₹{league?.entryFee}</h3>
//                         <p className="text-center">{new Date().toLocaleString()}</p>
//                     </div>
//                 </div>

//                 <div className="text-center mt-3">
//                     <button className="league-btn" onClick={downloadPDF}>
//                         Download PDF 📄
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // ================= FORM =================
//     return (
//         <div className="view-container">
//             <div className="form-wrapper">
//                 <div className="form-card">

//                     <h2 className="text-center mb-3">🏏 Player Registration</h2>
//                     <h4 className="text-center">{league?.name}</h4>

//                     <p className="text-center text-warning">
//                         Entry Fee: ₹{league?.entryFee}
//                     </p>

//                     <hr />

//                     {/* ✅ FIXED IMAGE PREVIEW */}
//                     <div className="text-center">
//                         <img
//                             src={preview || "/default.png"}
//                             alt="preview"
//                             className="player-image"
//                             style={{
//                                 width: "120px",
//                                 height: "120px",
//                                 objectFit: "cover",
//                                 borderRadius: "10px"
//                             }}
//                         />
//                     </div>

//                     <input className="input-field" name="name" placeholder="Name" onChange={handleChange} />
//                     <input className="input-field" name="village" placeholder="Village" onChange={handleChange} />
//                     <input className="input-field" name="phone" placeholder="Mobile" onChange={handleChange} />

//                     <select className="input-field" name="role" onChange={handleChange}>
//                         <option value="">Select Role</option>
//                         <option>Batsman</option>
//                         <option>Bowler</option>
//                         <option>All Rounder</option>
//                     </select>

//                     <input className="input-field" name="tshirtSize" placeholder="T-Shirt Size" onChange={handleChange} />
//                     <input className="input-field" name="pantSize" placeholder="Pant Size" onChange={handleChange} />

//                     <input
//                         type="file"
//                         className="input-field"
//                         accept="image/*"
//                         onChange={handlePhotoChange}
//                     />

//                     <button className="league-btn mt-2" onClick={handlePayment}>
//                         Pay & Register
//                     </button>

//                 </div>
//             </div>
//         </div>
//     );
// }

// export default RegisterPlayer;
// =================================
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
                const found = data.find((l) => l._id === leagueId);
                setLeague(found || null);
            })
            .catch(() => alert("Failed to load league"));
    }, [leagueId]);

    // ================= CHECK EXPIRY =================
    useEffect(() => {
        if (league && !checkedRef.current) {
            checkedRef.current = true;

            const expired = new Date() > new Date(league.lastDate);

            if (expired) {
                alert("Registration Closed ❌");
                navigate("/view-leagues");
            }
        }
    }, [league, navigate]);

    // ================= INPUT =================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ================= IMAGE PREVIEW =================
    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (preview) URL.revokeObjectURL(preview);

        const objectUrl = URL.createObjectURL(file);
        setPhoto(file);
        setPreview(objectUrl);
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // ================= SAVE PLAYER =================
    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key === "phone" ? "mobile" : key, value);
            });

            formDataToSend.append("leagueId", leagueId);

            if (photo) formDataToSend.append("photo", photo);

            await fetch(`${BASE_URL}/api/register`, {
                method: "POST",
                body: formDataToSend,
            });

            setShowReceipt(true);
        } catch (err) {
            console.error(err);
            alert("Registration failed ❌");
        }
    };

    // ================= PAYMENT =================
    const handlePayment = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.role) {
            return alert("Please fill required fields");
        }

        if (!league) return alert("Loading league...");

        try {
            const res = await fetch(`${BASE_URL}/api/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: league.entryFee }),
            });

            const data = await res.json();

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: data.amount,
                currency: "INR",
                name: "BatBallVc",
                description: `Registration ₹${league.entryFee}`,
                order_id: data.id,

                handler: async function () {
                    await handleSubmit();
                },

                prefill: {
                    name: formData.name,
                    contact: formData.phone,
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Payment failed ❌");
        }
    };

    // ================= PDF =================
    const downloadPDF = async () => {
        const canvas = await html2canvas(receiptRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
        pdf.save("Receipt.pdf");
    };

    // ================= LOADING =================
    if (!league) {
        return <h3 style={{ textAlign: "center" }}>Loading league...</h3>;
    }

    // ================= RECEIPT =================
    if (showReceipt) {
        return (
            <div className="view-container">
                <div className="form-wrapper">
                    <div ref={receiptRef} className="form-card">
                        <h2>Payment Successful ✅</h2>
                        <h4>{league.name}</h4>

                        <p>Name: {formData.name}</p>
                        <p>Village: {formData.village}</p>
                        <p>Mobile: {formData.phone}</p>
                        <p>Role: {formData.role}</p>

                        <h3>₹{league.entryFee}</h3>
                    </div>
                </div>

                <button onClick={downloadPDF}>Download PDF</button>
            </div>
        );
    }

    // ================= FORM =================
    return (
        <div className="view-container">
            <div className="form-wrapper">
                <div className="form-card">

                    <h2>🏏 Player Registration</h2>
                    <h4>{league.name}</h4>

                    <p>Entry Fee: ₹{league.entryFee}</p>

                    <img
                        src={preview || "/default.png"}
                        alt="preview"
                        style={{ width: 120, height: 120 }}
                    />

                    <input name="name" placeholder="Name" onChange={handleChange} />
                    <input name="village" placeholder="Village" onChange={handleChange} />
                    <input name="phone" placeholder="Mobile" onChange={handleChange} />

                    <select name="role" onChange={handleChange}>
                        <option value="">Select Role</option>
                        <option>Batsman</option>
                        <option>Bowler</option>
                        <option>All Rounder</option>
                    </select>

                    <input name="tshirtSize" placeholder="T-Shirt Size" onChange={handleChange} />
                    <input name="pantSize" placeholder="Pant Size" onChange={handleChange} />

                    <input type="file" onChange={handlePhotoChange} />

                    <button onClick={handlePayment}>Pay & Register</button>

                </div>
            </div>
        </div>
    );
}

export default RegisterPlayer;