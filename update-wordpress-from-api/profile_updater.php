<?php
/*
 * Class ProfileUpdater
 * Updates custom fields on a specific WordPress post for each blog with JSON data pulled from the Star Wars REST API
 *
 * Assumes this is a WordPress multisite install using the Advanced Custom Fields Pro (ACF) plugin
 */

abstract class ProfileUpdater {

  // Map JSON object properties to ACF field keys. For brevity, I'm assuming the ACF field names and the JSON properties are the same.
  protected $map = array();

  // list of WordPress blogs
  protected $blogs = array();

  // url of the next page of API results
  protected $nextPage = 'http://swapi.com/api/planets/';

  public function __construct() {
    global $wpdb; // WordPress's database interface object

    // get the list of sites from WordPress and store some information about each one in the blogs property
    foreach (get_sites(array('number' => 10000)) as $site) {
      if ($site->blog_id > 1) { // we want to skip the root site

        $subdomain = explode(".", $site->domain)[0];

        // $prefix is the MySQL table prefix for this blog
        $prefix = "wp_" . $site->blog_id . "_";

        // find the ID of the profile post; there should only be one per site
        $query = "SELECT `ID` FROM `{$prefix}posts` WHERE `post_type`='profile' AND `post_status`='publish' ORDER BY 'ID' ASC LIMIT 1";
        $result = $wpdb->get_results($query);

        // if the profile post exists, add the site data to the blogs array, using the subdomain as the key
        if ($result && $result[0] && $result[0]->ID) {
          $this->blogs[$subdomain] = array(
            "prefix" => $prefix,
            "post_id" => $result[0]->ID
          );
        }
      }
    }
  }

  // entry point to start the update process
  public function doUpdate() {
    // make sure child classes populated these necessary variables
    if ($this->nextPage && $this->map && count($this->map)) {
      $this->fetchData();
    }
  }

  // recursive method to pull pages of objects from the API
  protected function fetchData() {
    if ($this->nextPage) {
      try {
        // fetch a page from the API
        $data = file_get_contents($this->nextPage);
        if (!$data) {
          throw new Exception('Empty response body');
        }
        $data = json_decode($data);
        $this->nextPage = ''; // clear the nextPage property as a precaution

        // iterate over API response and call a method to update the profile post
        foreach ($data->results as $dataObject) {
          $subdomain = $this->APIPropertyToSubdomain($dataObject);
          $this->updateProfilePost($subdomain, $dataObject);
        }

        // if there's another page, set the nextPage property and call this method again
        if ($data->next) {
          $this->nextPage = $data->next;
          $this->fetchData();
        }

      } catch (Exception $e) {
        echo "Caught Exception - " . $e . "\n";
      }
    }
  }

  // gets the subdomain from the API object's name property
  // $dataObject: (Object) data object from the API
  // child classes can override this method if their API endpoint doesn't return a name property
  protected function APIPropertyToSubdomain($dataObject) {
    // sanitize_title_with_dashes is a WordPress function for slugifying a string
    return sanitize_title_with_dashes($dataObject->name);
  }

  // updates individual profile posts
  // $subdomain: (String) subdomain of the blog to update
  // $dataObject: (Object) data object from the API containing the fields to update
  protected function updateProfilePost($subdomain, $dataObject) {


    // make sure the blog exists
    $blog = $this->blogs[$subdomain];
    if ($blog) {
      // iterate over the map of ACF field names / keys and update the database
      foreach ($this->map as $fieldname => $fieldkey) {
        // escape API data before inserting it into the database
        $fieldvalue = $wpdb->prepare('%s', $dataObject->{$fieldname});
        if ($fieldvalue) {
          // Delete the old values and insert new the ones rather than using "INSERT ... ON DUPLICATE KEY UPDATE" because the postmeta table
          // may not have a composite unique index on post_id and meta_key
          $wpdb->query("DELETE FROM `{$blog['prefix']}postmeta` WHERE `post_id`={$blog['post_id']} AND `meta_key`='_{$fieldname}'");
          $wpdb->query("INSERT INTO `{$blog['prefix']}postmeta` SET `post_id`={$blog['post_id']}, `meta_key`='_{$fieldname}', `meta_value`='{$fieldkey}'");
          $wpdb->query("DELETE FROM `{$blog['prefix']}postmeta` WHERE `post_id`={$blog['post_id']} AND `meta_key`='{$fieldname}'");
          $wpdb->query("INSERT INTO `{$blog['prefix']}postmeta` SET `post_id`={$blog['post_id']}, `meta_key`='email', `meta_value`={$fieldvalue}");
        }
      }
    }
  }
}


/* Class PlanetProfileUpdater
 * Extends ProfileUpdater to populate film sites' profile posts from the films endpoint
 */

class PlanetProfileUpdater extends ProfileUpdater {
  public function __construct() {
    // set up map of planet-specific ACF field names to field keys
    $this->map = array(
      'name' => 'field_57e9b7afe6e1e',
      'climate' => 'field_5840387da4033',
      'terrain' => 'field_57e99b7e7feb5',
      'population' => 'field_57b49c2753c0f'
    );

    // set the initial endpoint url
    $this->nextPage = 'http://swapi.co/api/planets/'

    parent::__construct();
  }
}

/* Class FilmProfileUpdater
 * Extends ProfileUpdater to populate planet sites' profile posts from the planets endpoint
 */

class FilmProfileUpdater extends ProfileUpdater {
  public function __construct() {
    // set up map of film-specific ACF field names to field keys
    $this->map = array(
      'title' => 'field_57e9b7afe6e1e',
      'director' => 'field_5840387da4033',
      'producer' => 'field_57e99b7e7feb5',
      'release_date' => 'field_57b49c2753c0f'
    );

    // set the initial endpoint url
    $this->nextPage = 'http://swapi.co/api/films/'

    parent::__construct();
  }

  // gets the subdomain from the API object's title property
  // $dataObject: (Object) data object from the API
  // overrides parent function because this endpoint uses title instead of name
  protected function APIPropertyToSubdomain($dataObject) {
    return sanitize_title_with_dashes($dataObject->title);
  }
}


if (!function_exists('UpdateProfiles')) {
  // example usage as a WordPress shortcode
  function UpdateProfiles() {
    $planetUpdater = new PlanetProfileUpdater();
    $planetUpdater->doUpdate();

    $filmUpdater = new FilmProfileUpdater();
    $filmUpdater->doUpdate();
  }
  add_shortcode('update_profiles', 'UpdateProfiles');
}
?>
