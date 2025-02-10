<!DOCTYPE html>
<html>
<body>
    <h1>Halo, {{ $data['name'] }}!</h1>
    <p>Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.</p>
    <p>Masukkan kode berikut untuk memverifikasi reset password Anda: </p>
    <p>
        <h1 style="margin: auto 0">{{ join(" ",str_split($data['token'])) }}</h1>
    </p>
    <p>Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini.</p>
    <br>
    <p>Terima kasih,</p>
    <p>Tim Enkribsi</p>
</body>
</html>
