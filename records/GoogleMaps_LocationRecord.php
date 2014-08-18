<?php
namespace Craft;

class GoogleMaps_LocationRecord extends BaseRecord
{
    public function getTableName()
    {
        return 'googlemaps_locations';
    }

    protected function defineAttributes()
    {
        $coordColumn = array(
            AttributeType::Number,
            'column'   => ColumnType::Decimal,
            'length'   => 12,
            'decimals' => 8,
        );

        return array(
            'handle' => AttributeType::String,
            'address' => array(AttributeType::String, 'column' => ColumnType::Text),
            'addressComponents' => array(AttributeType::String, 'column' => ColumnType::Text),
            'title' => array(AttributeType::String, 'column' => ColumnType::Text),
            'content' => array(AttributeType::String, 'column' => ColumnType::Text),
            'icon' => array(AttributeType::String, 'column' => ColumnType::Text),
            'lat' => $coordColumn,
            'lng' => $coordColumn,
        );

    }

    public function defineRelations()
    {
        return array(
            'element' => array(static::BELONGS_TO, 'ElementRecord', 'required' => true, 'onDelete' => static::CASCADE)
        );
    }
}