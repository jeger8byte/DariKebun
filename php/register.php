<?php
// Koneksi ke database

$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Mengambil data dari atribut 'name' di input HTML Anda
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $role = 'user'; // Set role default sebagai 'user' 

    //cek apakah akun telah ada 
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn -> query($sql);

    if($result->num_rows >0){
      echo "<script> alert('Akun email telah ada!');
      window.location.href='../login.html'; </script>";
      return;
    }

    // Validasi sederhana agar tidak ada data kosong
    if (!empty($username) && !empty($email) && !empty($password)) {
        
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $username, $email, $hashed_password, $role);

        if ($stmt->execute()) {
            // Berhasil: Alihkan ke halaman login atau tampilkan pesan
            echo "<script>alert('Registrasi Berhasil!'); window.location.href='../login.html';</script>";

            
        } else {
            echo "Error: " . $stmt->error;
        }
    } else {
        echo "<script>alert('Harap isi semua kolom!');</script>";
    }
}
?>