<?php
namespace Craft;

class GoogleMaps_DirectionsModel extends BaseModel
{
	public function plot($map)
	{
		foreach($this->routes as $route)
		{
			$locations = array();
			$markers = array();

			foreach($route->legs as $index => $leg)
			{	
				$icon = 'http://mt.google.com/vt/icon/text='.(chr(65 + $index)).'&psize=16&font=fonts/arialuni_t.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=48&scale=2';

				$locations[] = array(
					'address' => $leg->start_address,
					'lat' => $leg->start_location->lat,
					'lng' => $leg->start_location->lng,
				);

				$markers[] = array(
					'content' => $leg->start_address,
					'lat' => $leg->start_location->lat,
					'lng' => $leg->start_location->lng,
					'icon' => array(
						'url' => $icon,
						'scaledSize' => array(22, 40)
					)
				);

				if($index == count($route->legs) - 1)
				{
					$icon = 'http://mt.google.com/vt/icon/text='.(chr(65 + $index + 1)).'&psize=16&font=fonts/arialuni_t.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=2';

					$markers[] = array(
						'content' => $leg->end_address,
						'lat' => $leg->end_location->lat,
						'lng' => $leg->end_location->lng,
						'icon' => array(
							'url' => $icon,
							'scaledSize' => array(22, 40)
						)
					);

					$locations[] = array(
						'address' => $leg->end_address,
						'lat' => $leg->end_location->lat,
						'lng' => $leg->end_location->lng,
					);
				}
			}

			craft()->templates->includeJs('
				new GoogleMaps.Route('.$map.', {
					fitBounds: true,
					locations: '.json_encode($locations).',
					markers: '.json_encode($markers).',
					directionsRendererOptions: {
						suppressMarkers: true,
						suppressInfoWindows: true,
						preserveViewport: true
					},
					directionsRequestOptions: '.json_encode($this->options).'
				});
			');

		}
	}

    protected function defineAttributes()
    {
        return array(
            'routes' => array(AttributeType::Mixed, 'default' => array()),
            'options' => array(AttributeType::Mixed, 'default' => array()),
            'status'=> array(AttributeType::Mixed, 'default' => false),
        );
    }
}