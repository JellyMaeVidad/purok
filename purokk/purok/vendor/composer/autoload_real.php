<?php

// autoload_real.php @generated by Composer

class ComposerAutoloaderInit217809b8707b18b31ba8b23b50d0e91e
{
    private static $loader;

    public static function loadClassLoader($class)
    {
        if ('Composer\Autoload\ClassLoader' === $class) {
            require __DIR__ . '/ClassLoader.php';
        }
    }

    /**
     * @return \Composer\Autoload\ClassLoader
     */
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        require __DIR__ . '/platform_check.php';

        spl_autoload_register(array('ComposerAutoloaderInit217809b8707b18b31ba8b23b50d0e91e', 'loadClassLoader'), true, true);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader(\dirname(__DIR__));
        spl_autoload_unregister(array('ComposerAutoloaderInit217809b8707b18b31ba8b23b50d0e91e', 'loadClassLoader'));

        require __DIR__ . '/autoload_static.php';
        call_user_func(\Composer\Autoload\ComposerStaticInit217809b8707b18b31ba8b23b50d0e91e::getInitializer($loader));

        $loader->register(true);

        return $loader;
    }
}
