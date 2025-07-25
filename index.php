<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dark Froxty</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <div class="container">
        <div class="logo animated">
            <!-- Animated logo placeholder -->
            <span>🦇</span>
            <h1>Dark Froxty</h1>
        </div>
        <form id="lookup-form" autocomplete="off">
            <input type="text" id="phone" name="phone" placeholder="Enter phone number" required pattern="\\d{10,15}">
            <button type="submit">Lookup</button>
        </form>
        <div id="loading" class="loading hidden">
            <div class="spinner"></div>
            <span>Loading...</span>
        </div>
        <div id="result" class="result"></div>
    </div>
    <script src="assets/app.js"></script>
</body>
</html>