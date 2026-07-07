<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="Enter your comprehensive website description here. Make it engaging for search engines.">
    <meta name="keywords" content="keyword1, keyword2, your industry, your brand">
    <meta name="author" content="Empire One">
    <meta name="robots" content="index, follow">

    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:title" content="{{ config('app.name', 'Laravel') }}">
    <meta property="og:description" content="Enter your comprehensive website description here. Make it engaging for search engines.">
    <meta property="og:image" content="{{ asset('/images/eo-full-logo.png') }}">
    <meta property="og:image:width" content="800">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{{ url('/') }}">
    <meta name="twitter:title" content="{{ config('app.name', 'Laravel') }}">
    <meta name="twitter:description" content="Enter your comprehensive website description here. Make it engaging for search engines.">
    <meta name="twitter:image" content="{{ asset('/images/eo-full-logo.png') }}">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <link rel="icon" type="image/png" href="/images/empireone.png.png">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/app/pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>