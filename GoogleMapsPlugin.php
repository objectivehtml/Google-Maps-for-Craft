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
        return '0.3.0';
    }

    public function getDeveloper()
    {
        return 'Objective HTML';
    }

    public function getDeveloperUrl()
    {
        return 'https://objectivehtml.com';
    }
}