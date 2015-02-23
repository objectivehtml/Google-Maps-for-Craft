<?php
namespace Craft;

use Craft\Plugins\Postmaster\Components\BaseParcelType;

class GoogleMapsParcelType extends BaseParcelType
{
	public $name = 'Google Maps';

	public $id = 'googlemaps';

	public function getSettingsModelClassName()
	{
		return '\Craft\Postmaster_DefaultParcelTypeSettingsModel';
	}

}