<?php
// Fallback for directory roots on servers without DirectoryIndex AllowOverride
readfile(__DIR__ . '/index.html');
