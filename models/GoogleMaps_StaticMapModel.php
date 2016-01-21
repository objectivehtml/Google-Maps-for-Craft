<?php
namespace Craft;

class GoogleMaps_StaticMapModel extends BaseModel
{
	public function getParameters()
	{
		$params = array();

		foreach($this->getAttributes() as $attr => $value)
		{
			if(!is_array($value) && $value)
			{
				$params[] = $attr.'='.$value;
			}
			else if(is_array($value))
			{
				foreach($value as $obj)
				{
					$params[] = str_replace('#', '%23', $obj->getStaticMapParameters());
				}
			}
		}

		return implode('&', $params);
	}

	public static function populateModel($data)
	{
		$model = parent::populateModel($data);

		if(isset($data['width']) && $data['height'])
		{
			$model->size = $data['width'].'x'.$data['height'];
		}

		return $model;
	}

    protected function defineAttributes()
    {
        return array(
            // Location Parameters
            'format' => array(AttributeType::String, 'default' => 'png'),
            'center' => array(AttributeType::Mixed, 'default' => false),
            'maptype' => array(AttributeType::Mixed, 'default' => false),
            'markers' => array(AttributeType::Mixed, 'default' => array()),
            'paths' => array(AttributeType::Mixed, 'default' => array()),
            'scale' => array(AttributeType::Number, 'default' => 1),
            'style' => array(AttributeType::Mixed, 'default' => false),            
            'size' => array(AttributeType::Mixed, 'default' => '400x300'),
            'zoom' => array(AttributeType::Mixed, 'default' => false),
        );
    }
}