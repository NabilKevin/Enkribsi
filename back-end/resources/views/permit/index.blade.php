<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Permintaan Izin Urgent</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        h1, h3 {
            margin: 0 0 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table th, table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        table th {
            background-color: #f4f4f4;
            font-weight: bold;
        }
        a {
            color: #007BFF;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .urgent {
            color: #FF4D4D;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Halo, {{ $data['name'] }}</h1>
    <h3>Ada permintaan izin yang <span class="urgent">URGENT</span> dari {{ $data['employee']['username'] }}</h3>

    <table>
        <thead>
            <tr>
                <th>Nama Pegawai</th>
                <th>Tanggal Izin</th>
                <th>Alasan</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $data['employee']['username'] }}</td>
                <td>{{ $data['employee']['date'] }}</td>
                <td>{{ $data['employee']['reason'] }}</td>
                <td>{{ $data['employee']['status'] }}</td>
            </tr>
        </tbody>
    </table>

    <p>Pergi ke dashboard untuk melakukan persetujuan: <a href="http://localhost:8000">Klik disini</a></p>
</body>
</html>
