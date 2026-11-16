const db = require('../config/database.cjs'); // samakan path-nya dengan authController.cjs
const bcrypt = require('bcryptjs'); // gunakan 'bcrypt' jika di authController.cjs memakai 'bcrypt'

// 1. Ambil semua daftar user
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT u.id, u.nama, u.nip, u.username, u.role, u.id_bagian,
             mb.nama_bagian, u.jabatan, u.status_aktif, u.created_at
      FROM users u
      LEFT JOIN master_bagian mb ON u.id_bagian = mb.id
      ORDER BY u.id ASC
    `);
        return res.json(rows);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Tambah user baru oleh Admin
const createUser = async (req, res) => {
    try {
        const { nama, nip, username, password, role, id_bagian, jabatan, status_aktif } = req.body;

        if (!nama || !username || !password || !role) {
            return res.status(400).json({ success: false, message: 'Nama, username, password, dan role wajib diisi.' });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Username sudah digunakan oleh akun lain.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const bagianId = id_bagian ? Number(id_bagian) : null;
        const aktif = status_aktif !== undefined ? (status_aktif ? 1 : 0) : 1;

        await db.query(
            `INSERT INTO users (nama, nip, username, password, role, id_bagian, jabatan, status_aktif)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nama, nip || null, username, hashedPassword, role, bagianId, jabatan || role, aktif]
        );

        return res.status(201).json({ success: true, message: 'User baru berhasil ditambahkan.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Edit data user / reset password / nonaktifkan akun
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, nip, username, password, role, id_bagian, jabatan, status_aktif } = req.body;

        const [existing] = await db.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, id]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Username sudah dipakai user lain.' });
        }

        const bagianId = id_bagian ? Number(id_bagian) : null;
        const aktif = status_aktif ? 1 : 0;

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                `UPDATE users SET nama = ?, nip = ?, username = ?, password = ?, role = ?, id_bagian = ?, jabatan = ?, status_aktif = ?
         WHERE id = ?`,
                [nama, nip || null, username, hashedPassword, role, bagianId, jabatan, aktif, id]
            );
        } else {
            await db.query(
                `UPDATE users SET nama = ?, nip = ?, username = ?, role = ?, id_bagian = ?, jabatan = ?, status_aktif = ?
         WHERE id = ?`,
                [nama, nip || null, username, role, bagianId, jabatan, aktif, id]
            );
        }

        return res.json({ success: true, message: 'Data user berhasil diperbarui.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Hapus user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number(id) === Number(req.user.id)) {
            return res.status(400).json({ success: false, message: 'Tidak dapat menghapus akun Admin yang sedang digunakan.' });
        }

        await db.query('DELETE FROM users WHERE id = ?', [id]);
        return res.json({ success: true, message: 'User berhasil dihapus.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser };