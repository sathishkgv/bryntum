<?php
// initialize application
include 'init.php';

$app->db->exec('alter table assignments drop foreign key `fk_assignments_resources`');
$app->db->exec('alter table assignments drop foreign key `fk_assignments_tasks`');
$app->db->exec('alter table calendar_intervals drop foreign key `fk_calendar_intervals_calendars`');
$app->db->exec('alter table calendars drop foreign key `fk_calendars_calendars`');
$app->db->exec('alter table dependencies drop foreign key `fk_dependencies_tasks`');
$app->db->exec('alter table dependencies drop foreign key `fk_dependencies_tasks1`');
$app->db->exec('alter table resources drop foreign key `fk_resources_calendars`');
$app->db->exec('alter table tasks drop foreign key `fk_tasks_calendars`');
$app->db->exec('alter table tasks drop foreign key `fk_tasks_tasks`');
//print_r($app->db->errorInfo());

$app->db->exec('truncate table dependencies');
$app->db->exec('truncate table calendar_intervals');
$app->db->exec('truncate table assignments');
$app->db->exec('truncate table resources');
$app->db->exec('truncate table calendars');
$app->db->exec('truncate table tasks');
$app->db->exec('truncate table options');

$app->db->exec('alter table assignments add constraint `fk_assignments_tasks` foreign key (`event`) references `tasks`(`id`),');
$app->db->exec('alter table assignments add constraint `fk_assignments_resources` foreign key (`resource`) references `resources`(`id`)');
$app->db->exec('alter table calendar_intervals add constraint `fk_calendar_intervals_calendars` foreign key (`calendar`) references `calendars`(`id`)');
$app->db->exec('alter table calendars add constraint `fk_calendars_calendars` foreign key (`parentId`) references `calendars`(`id`)');
$app->db->exec('alter table dependencies add constraint `fk_dependencies_tasks` foreign key (`fromEvent`) references `tasks`(`id`),');
$app->db->exec('alter table dependencies add constraint `fk_dependencies_tasks1` foreign key (`toEvent`) references `tasks`(`id`)');
$app->db->exec('alter table resources add constraint `fk_resources_calendars` foreign key (`calendar`) references `calendars`(`id`)');
$app->db->exec('alter table tasks add constraint `fk_tasks_calendars` foreign key (`calendar`) references `calendars`(`id`)');
$app->db->exec('alter table tasks add constraint `fk_tasks_tasks` foreign key (`parentId`) references `tasks`(`id`)');

// init server revision stamp
$app->insert('options', ['name' => 'revision', 'value' => '1']);
$app->insert('options', ['name' => 'projectCalendar', 'value' => '1']);
$app->insert('options', ['name' => 'projectStartDate', 'value' => '2019-01-14']);
