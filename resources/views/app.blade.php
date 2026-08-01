<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="EmpireOneCX Careers delivers AI-assisted customer experience, BPO, back-office, and customer support outsourcing solutions that help teams scale faster.">
    <meta name="keywords" content="EmpireOneCX Careers | Customer Experience & Global Outsourcing Services, professional services, innovative solutions, expert guidance, business growth">
    <meta name="author" content="EmpireOneCX Careers | Customer Experience & Global Outsourcing Services">
    <meta name="robots" content="index, follow">

    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:title" content="{{ config('app.name', 'EmpireOneCX Careers | Customer Experience & Global Outsourcing Services') }}">
    <meta property="og:description" content="EmpireOneCX Careers delivers AI-assisted customer experience, BPO, back-office, and customer support outsourcing solutions that help teams scale faster.">
    <meta property="og:image" content="{{ asset('/images/E1icon.png') }}">
    <meta property="og:image:width" content="800">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{{ url('/') }}">
    <meta name="twitter:title" content="{{ config('app.name', 'EmpireOneCX Careers | Customer Experience & Global Outsourcing Services') }}">
    <meta name="twitter:description" content="EmpireOneCX Careers delivers AI-assisted customer experience, BPO, back-office, and customer support outsourcing solutions that help teams scale faster.">
    <meta name="twitter:image" content="{{ asset('/images/E1icon.png') }}">

    <title inertia>{{ config('app.name', 'EmpireOneCX Careers | Customer Experience & Global Outsourcing Services') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <link rel="icon" type="image/png" href="/images/E1icon.png">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/app/pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>