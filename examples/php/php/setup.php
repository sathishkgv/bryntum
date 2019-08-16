<?php

// initialize application
include 'init.php';

function getDSNParts($dsn, $names)
{
    $parts = [];
    foreach ($names as $name) {
        preg_match("/$name=(.+?)(;|\$)/", $dsn, $matches);
        $parts[] = @$matches[1];
    }
    return $parts;
}

// read the database connection parameters
list($dbname, $host) = getDSNParts(DSN, ['dbname', 'host']);

if (!$dbname) throw new Exception('Could not get database from the DSN string.');
if (!$host) throw new Exception('Could not get host from the DSN string.');

$user = DBUSERNAME;
$pwd = DBUSERPASSWORD;

$script =  dirname(__DIR__) .'/sql/setup.sql';

$command = "mysql -v --host=$host --user=$user --password='$pwd' --database=$dbname < '$script'";

echo "Executing sql/setup.sql:<pre>";

system($command, $retval);

if ($retval) throw new Exception('Database creation has failed.');