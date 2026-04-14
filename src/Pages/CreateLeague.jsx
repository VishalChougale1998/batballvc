import { useState } from "react";
import BASE_URL from "../api";

function CreateLeague() {
    const [form, setForm] = useState({
        name: "",
        village: "",
        playerLimit: "",
        entryFee: "",
        lastDate: "",
        slug: ""   // ✅ NEW
    });

    const [banner, setBanner] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            // 🔥 VALIDATION
            if (!form.name || !form.village || !form.playerLimit || !form.entryFee || !form.lastDate) {
                return alert("Please fill all fields");
            }

            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("village", form.village);
            formData.append("playerLimit", form.playerLimit);
            formData.append("entryFee", form.entryFee);
            formData.append("lastDate", form.lastDate);

            // ✅ AUTO SLUG (if empty)
            const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
            formData.append("slug", slug);

            formData.append("banner", banner);

            await fetch(`${BASE_URL}/api/create-league`, {
                method: "POST",
                body: formData
            });

            alert("League Created Successfully ✅");

            // 🔥 RESET FORM
            setForm({
                name: "",
                village: "",
                playerLimit: "",
                entryFee: "",
                lastDate: "",
                slug: ""
            });
            setBanner(null);

        } catch (err) {
            console.log(err);
            alert("Error creating league");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Create League</h2>

            <input
                name="name"
                placeholder="League Name"
                value={form.name}
                onChange={handleChange}
            />

            <input
                name="village"
                placeholder="Village"
                value={form.village}
                onChange={handleChange}
            />

            <input
                name="playerLimit"
                placeholder="Max Players"
                value={form.playerLimit}
                onChange={handleChange}
            />

            <input
                name="entryFee"
                placeholder="Entry Fee"
                value={form.entryFee}
                onChange={handleChange}
            />

            <input
                type="date"
                name="lastDate"
                value={form.lastDate}
                onChange={handleChange}
            />

            {/* ✅ SLUG */}
            <input
                name="slug"
                placeholder="Slug (optional)"
                value={form.slug}
                onChange={handleChange}
            />

            {/* ✅ BANNER */}
            <input
                type="file"
                onChange={(e) => setBanner(e.target.files[0])}
            />

            <br /><br />

            <button onClick={handleSubmit}>
                Create League
            </button>
        </div>
    );
}

export default CreateLeague;