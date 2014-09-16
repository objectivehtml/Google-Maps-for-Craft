<?php

return array(

	// Define the length a map stays in the cache (in days). If false, cache never expires.
	'staticMapCacheLength' => false,

	// Define the absolute path for the directory for the static map cache
	'staticMapCachePath' => false,

	// Define the public url for the directory for the static map cache
	'staticMapCacheUrl' => false,

	'availableMapButtons' => array(
		array('label' => 'List', 'value' => 'list'),
		array('label' => 'Refresh', 'value' => 'refresh'),
		array('label' => 'Markers', 'value' => 'markers'),
		array('label' => 'Routes', 'value' => 'routes'),
		array('label' => 'Polygons', 'value' => 'polygons'),
		array('label' => 'Polylines', 'value' => 'polylines'),
		array('label' => 'Circles', 'value' => 'circles'),
		array('label' => 'Images', 'value' => 'images'),
	)

);