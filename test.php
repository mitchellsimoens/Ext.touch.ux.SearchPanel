<?php

$people = array(
    array('firstName' => 'Mitchell', 'lastName' => 'Simoens'),
    array('firstName' => 'Tommy',    'lastName' => 'Maintz'),
    array('firstName' => 'Rob',      'lastName' => 'Dougan'),
    array('firstName' => 'Ed',       'lastName' => 'Spencer'),
    array('firstName' => 'Jamie',    'lastName' => 'Avins'),
    array('firstName' => 'Dave',     'lastName' => 'Kaneda'),
    array('firstName' => 'Michael',  'lastName' => 'Mullany'),
    array('firstName' => 'Aaron',    'lastName' => 'Conran'),
    array('firstName' => 'Abraham',  'lastName' => 'Elias'),
    array('firstName' => 'Jay',      'lastName' => 'Robinson')
);

if (isset($_REQUEST['filter'])) {
    $filters = str_replace('\\', '', $_REQUEST['filter']);
    $filters = json_decode($filters);
}

if (!$filters) {
    $return = $people;
} else {
    $return = array();
    
    foreach ($people as $person) {
        $add = false;

        foreach ($filters as $filter) {
            $field = $filter->property;
            $value = $filter->value;

            if (stripos($person[$field], $value) !== false) {
                $add = true;
            }
        }

        if ($add) {
            array_push($return, $person);
        }
    }
}

echo json_encode($return);

?>