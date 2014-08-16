<?php
namespace Craft;

class GoogleMapsPlugin extends BasePlugin
{
    public function getName()
    {
         return Craft::t('Google Maps');
    }

    public function getVersion()
    {
        return '0.0.1';
    }

    public function getDeveloper()
    {
        return 'Objective HTML';
    }

    public function getDeveloperUrl()
    {
        return 'https://objectivehtml.com';
    }

    public function test()
    {
        exit('test');
    } 
}