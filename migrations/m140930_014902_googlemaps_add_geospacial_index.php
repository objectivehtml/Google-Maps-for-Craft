<?php
namespace Craft;

/**
 * The class name is the UTC timestamp in the format of mYYMMDD_HHMMSS_pluginHandle_migrationName
 */
class m140930_014902_googlemaps_add_geospacial_index extends BaseMigration
{
	/**
	 * Any migration code in here is wrapped inside of a transaction.
	 *
	 * @return bool
	 */
	public function safeUp()
	{
		/*
		$table = $this->dbConnection->addTablePrefix('googlemaps_locations');

		$this->dbConnection->createCommand()->dropForeignKey('googlemaps_locations', 'elementId');

		$this->addColumnAfter('googlemaps_locations', 'coordinate', array(
			'column' => 'POINT',
			'null' => false
		), 'lng');

		$command = $this->dbConnection->createCommand("UPDATE $table SET coordinate = GeomFromText(CONCAT('POINT (', lng, ' ', lat, ')'))");
		$command->execute();

		$command = $this->dbConnection->createCommand("ALTER TABLE $table ENGINE=MyISAM;");
		$command->execute();

		$command = $this->dbConnection->createCommand("CREATE SPATIAL INDEX coordinate ON $table (coordinate)");
		$command->execute();
		*/

		return true;
	}
}
