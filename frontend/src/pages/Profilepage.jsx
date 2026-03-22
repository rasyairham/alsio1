import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const userEmail = localStorage.getItem("email");
    const savedImage = localStorage.getItem("userImage");
    
    // Proteksi Halaman: Jika tidak login, tendang ke login
    if (!token) {
      navigate("/login");
      return;
    }

    setUser(username || "User");
    setEmail(userEmail || ""); 
    // Pastikan tidak mengambil string "null" sebagai data gambar
    setProfileImage(savedImage && savedImage !== "null" ? savedImage : null);
  }, [navigate]);

  const openEditModal = () => {
    setTempName(user);
    setTempImage(profileImage);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) { // Limit 2MB
        alert("Ukuran foto terlalu besar! Maksimal 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setTempImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!tempName.trim()) return alert("Username tidak boleh kosong!");

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          username: tempName,
          profileImage: tempImage // Mengirimkan base64 string
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- SINKRONISASI KRUSIAL ---
        localStorage.setItem("username", data.username);
        // Simpan foto baru, atau hapus jika null (agar tidak stuck foto lama)
        if (data.profileImage) {
          localStorage.setItem("userImage", data.profileImage);
        } else {
          localStorage.removeItem("userImage");
        }

        setUser(data.username);
        setProfileImage(data.profileImage || null);
        setIsModalOpen(false);
        
        // Beritahu Navbar dan komponen lain untuk update UI
        window.dispatchEvent(new Event("storage"));
        alert("Profil berhasil diperbarui!");
      } else {
        alert(data.message || "Gagal memperbarui profil");
      }
    } catch (err) {
      console.error("Gagal simpan:", err);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center px-6 py-24 text-white">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      
      <div className="relative w-full max-w-lg">
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-2xl shadow-2xl text-center">
          
          {/* Avatar Area */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-2xl scale-110"></div>
            <div className="relative w-32 h-32 rounded-full bg-slate-950 p-1 shadow-2xl overflow-hidden border border-white/10 flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full">
                    <span className="text-5xl font-black">{getInitial(user)}</span>
                  </div>
                )}
            </div>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight mb-1 truncate px-4">{user}</h1>
            <p className="text-blue-400/80 font-medium tracking-widest text-[10px] uppercase italic">ALSIO Explorer</p>
          </div>

          {/* Email Info Card */}
          <div className="space-y-4 text-left mb-10">
            <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 border border-white/5 shadow-inner">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <i className="ri-mail-line text-blue-400 text-xl"></i>
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Email Address</p>
                <p className="text-sm font-medium text-white/90 truncate">{email || "Tidak ada email"}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={openEditModal} 
              className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 group active:scale-95"
            >
              <i className="ri-edit-box-line text-lg"></i> Edit Profile
            </button>
            <button onClick={handleLogout} className="w-full py-3 text-red-500/60 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-red-500 transition-colors">
              — Logout System —
            </button>
          </div>
        </div>
      </div>

      {/* Modal Edit Profile */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => !loading && setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-8 text-center">Update Details</h2>
            <form onSubmit={handleSaveChanges} className="space-y-6">
              
              {/* Profile Image Picker */}
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="relative w-24 h-24 rounded-full border-2 border-blue-500/50 p-1 cursor-pointer group transition-transform active:scale-90" 
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10">
                    {tempImage ? (
                      <img src={tempImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <i className="ri-camera-3-fill text-3xl text-zinc-600"></i>
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Ganti</span>
                    </div>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 tracking-widest">Display Name</label>
                  <input 
                    type="text" 
                    value={tempName} 
                    onChange={(e) => setTempName(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:border-blue-500 outline-none transition-all text-white font-bold" 
                    placeholder="Masukkan nama..."
                    required
                  />
                </div>
              </div>

              {/* Action Buttons inside Modal */}
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  disabled={loading}
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-3 rounded-xl bg-white/5 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-blue-600 font-bold text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;