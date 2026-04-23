<?php

  function loadEnv($path)
{ 
    global $_ENV;
    if (!file_exists($path)) return [];

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    $vars = [];

    foreach ($lines as $line) {

        // skip komentar
        if (strpos(trim($line), '#') === 0) continue;

        // pecah KEY=VALUE
        list($key, $value) = explode('=', $line, 2);

        $key = trim($key);
        $value = trim($value);

        $_ENV[$key] = $value;
        putenv("$key=$value");
    }

    return $vars;
}