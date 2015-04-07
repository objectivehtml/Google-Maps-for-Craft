<?php
namespace Craft;

class GoogleMapsService extends BaseApplicationComponent {
	
	public function getUnitMultiplier($unit = 'miles')
    {
        $units = array(
            'mi' => 1,
            'miles' => 1,
            'ft' => 5280,
            'feet' => 5280,
            'km' => 1.609344,
            'kilometres' => 1.609344,
            'kilometers' => 1.609344,
            'm' => 1609.344,
            'metres' => 1609.344,
            'meters' => 1609.344,
        );
        
        $unit = strtolower($unit);

        return isset($units[$unit]) ? $units[$unit] : $units['miles'];
    }
    
}