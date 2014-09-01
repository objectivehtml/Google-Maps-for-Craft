<?php
namespace Craft;

class GoogleMaps_DirectionsService extends BaseApplicationComponent
{
	public $url = 'http://maps.googleapis.com/maps/api/directions/json';

	public $expirationLength = 365; // In days

    protected $options = array();

    public function route($options)
    {
        $url = $this->getUrl($options);

        $client = new \Guzzle\Http\Client;
        
        $response = $client->get($url);

        $response->send();

        $response = (string) $response->getResponse()->getBody();

        return new GoogleMaps_DirectionsModel(array_merge((array) json_decode($response), array('options' => $options)));

        /*
    	$encodedAddress = urlencode($address);
    	
    	$url = $this->url.'?address='.$encodedAddress;

    	$expires = date('Y-m-d H:i:s', time() - $this->expirationLength * 24 * 60 * 60);

    	$results = GoogleMaps_GeocoderCacheRecord::model()->find('query = :query AND dateCreated >= :date', array(
    		':query' => $encodedAddress,
    		':date' => $expires
    	));

    	if($results)
    	{
    		return json_decode($results->response);
    	}

    	$client = new \Guzzle\Http\Client;
    	
    	$response = $client->get($url);

    	$response->send();

    	$response = (string) $response->getResponse()->getBody();

    	$this->cacheResponse($encodedAddress, $response);

    	return json_decode($response);
        */
    }

    public function getUrl($options = array())
    {
        $params = array();

        if(!isset($options['origin']))
        {
            throw new Exception('You must set an origin before you can get directions');
        }

        if(!isset($options['destination']))
        {
            throw new Exception('You must set an origin before you can get directions');
        }

        $params['origin'] = $options['origin'];
        $params['destination'] = $options['destination'];
        $params['avoid'] = array();

        if(isset($options['waypoints']))
        {
            $params['waypoints'] = implode('|', $options['waypoints']);
        }

        if(isset($options['optimizeWaypoints']) && $options['optimizeWaypoints'] === true)
        {
            $params['waypoints'] = 'optimize:true|'.$params['waypoints'];
        }

        if(isset($options['provideRouteAlternatives']) && $options['provideRouteAlternatives'] === true)
        {
            $params['alternatives'] = 'true';
        }

        if(isset($options['language']))
        {
            $params['language'] = $options['language'];
        }

        if(isset($options['travelMode']))
        {
            $params['mode'] = $options['travelMode'];
        }

        if(isset($options['region']))
        {
            $params['region'] = $options['region'];
        }

        if(isset($options['unitSystem']))
        {
            $params['unit'] = $options['unitSystem'];
        }

        if(isset($options['avoidFerries']))
        {
            $params['avoid'][] = 'ferries';
        }

        if(isset($options['avoidHighways']))
        {
            $params['avoid'][] = 'highways';
        }

        if(isset($options['avoidTolls']))
        {
            $params['avoid'][] = 'tolls';
        }

        if(!count($params['avoid']))
        {
            unset($params['avoid']);
        }
        else
        {
            $params['avoid'] = implode('|', $params['avoid']);
        }

        return $this->url . '?' . http_build_query($params);
    }

    public function cacheResponse($query, $response)
    {
    	$record = new GoogleMaps_GeocoderCacheRecord;
    	$record->query = $query;
    	$record->response = $response;
    	$record->save();

    	return $record;
    }
}
