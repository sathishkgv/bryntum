// prepare "namespace"
window.bryntum         = window.bryntum || {};
window.bryntum.locales = window.bryntum.locales || {};

// put the locale under window.bryntum.locales to make sure it is discovered automatically
window.bryntum.locales.De = {

    localeName : 'De',
    localeDesc : 'Deutsch',

    //region Columns

    AddNewColumn : {
        'New Column' : 'Neue Spalte hinzufügen...'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Frühes Startdatum'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Frühes Ende'
    },

    LateStartDateColumn : {
        'Late Start' : 'Später Start'
    },

    LateEndDateColumn : {
        'Late End' : 'Spätes Ende'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Gesamte Pufferzeit'
    },

    CalendarColumn : {
        Calendar : 'Kalender'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Einschränkung Datum'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Einschränkung'
    },

    DependencyColumn : {
        'Invalid dependency found, change is reverted' : 'Ungültige Abhängigkeit gefunden, Änderung rückgängig gemacht'
    },

    DurationColumn : {
        Duration : 'Dauer'
    },

    EffortColumn : {
        Effort : 'Aufwand'
    },

    EndDateColumn : {
        Finish : 'Fertig stellen'
    },

    EventModeColumn : {
        'Event mode' : 'Ereignismodus',
        'Manual'     : 'Manuell',
        'Auto'       : 'Auto'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuell geplant'
    },

    MilestoneColumn : {
        'Milestone' : 'Meilenstein'
    },

    NameColumn : {
        Name : 'Vorgangsname'
    },

    NoteColumn : {
        Note : 'Notiz'
    },

    PercentDoneColumn : {
        '% Done' : '% erledigt'
    },

    PredecessorColumn : {
        Predecessors : 'Vorgänger'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Zugwiesene Resourcen'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Modus'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Zur Zeitachse hinzufügen'
    },
    
    SequenceColumn : {
        Sequence : '#'
    },

    StartDateColumn : {
        Start : 'Anfang'
    },

    SuccessorColumn : {
        Successors : 'Nachfolger'
    },

    WBSColumn : {
        WBS : 'WBS'
    },

    //endregion

    //region Gantt

    ProjectLines : {
        'Project Start' : 'Projektstart',
        'Project End'   : 'Projektabende'
    },

    TaskEdit : {
        Information  : 'Aufgabeninformationen',
        General      : 'Generell',
        Predecessors : 'Vorgänger',
        Resources    : 'Resourcen',
        Notes        : 'Notizen',
        Advanced     : 'Fortgeschritten',
        Name         : 'Name',
        Done         : 'Abgeschlossen in Prozent',
        Duration     : 'Dauer',
        Start        : 'Start',
        Finish       : 'Ende',
        Save         : 'Speichern',
        Cancel       : 'Abbrechen',
        Edit         : 'Buchung redigieren'
    },

    TaskTooltip : {
        Start    : 'Beginnt',
        End      : 'Endet',
        Duration : 'Dauer',
        Complete : 'Erledigt'
    },

    AssignmentGrid : {
        Name     : 'Ressourcenname',
        Units    : 'Einheiten',
        '%'      : '%',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        'Save'   : 'Sparen',
        'Cancel' : 'Stornieren'
    },

    AssignmentEditGrid : {
        Name  : 'Resourcenname',
        Units : 'Einheiten'
    },

    ConstraintTypePicker : {
        'Finish no earlier than' : 'Ende nicht früher als',
        'Finish no later than'   : 'Ende nicht später als',
        'Must start on'          : 'Muss anfangen am',
        'Must finish on'         : 'Muss enden am',
        'Start no earlier than'  : 'Anfang nicht früher als',
        'Start no later than'    : 'Anfang nicht später als'
    },

    Gantt : {
        'Add'         : 'Hinzufügen...',
        'New Task'    : 'Neue Aufgabe',
        'Task above'  : 'Aufgabe vor',
        'Task below'  : 'Aufgabe unter',
        'Delete task' : 'Lösche Aufgabe(n)',
        Milestone     : 'Meilenstein',
        'Sub-task'    : 'Unteraufgabe',
        Successor     : 'Nachfolger',
        Predecessor   : 'Vorgänger'
    },

    GanttCommon : {
        SS              : 'AA',
        SF              : 'EA',
        FS              : 'AE',
        FF              : 'EE',
        StartToStart    : 'Anfang-Anfang',
        StartToEnd      : 'Anfang-Ende',
        EndToStart      : 'Enge-Anfang',
        EndToEnd        : 'Enge-Ende',
        dependencyTypes : [
            'AA',
            'EA',
            'AE',
            'EE'
        ],
        dependencyTypesLong : [
            'Anfang-Anfang',
            'Anfang-Ende',
            'Enge-Anfang',
            'Enge-Ende'
        ]
    },

    TaskEditor : {
        'editorWidth' : '50em',
        'Information' : 'Informationen',
        'Save'        : 'Sparen',
        'Cancel'      : 'Stornieren',
        'Delete'      : 'Löschen'
    },

    GeneralTab : {
        labelWidth   : '15em',
        'General'    : 'Generell',
        'Name'       : 'Name',
        '% complete' : 'Abgeschlossen in Prozent',
        'Duration'   : 'Dauer',
        'Start'      : 'Start',
        'Finish'     : 'Ende',
        'Effort'     : 'Anstrengung',
        'Dates'      : 'Datumsangaben'
    },

    AdvancedTab : {
        labelWidth           : '15em',
        'Advanced'           : 'Fortgeschritten',
        'Calendar'           : 'Kalender',
        'Scheduling mode'    : 'Planungsmodus',
        'Effort driven'      : 'Mühe getrieben',
        'Manually scheduled' : 'Manuell geplant',
        'Constraint type'    : 'Einschränkungstyp',
        'Constraint date'    : 'Datum der Einschränkung',
        'Constraint'         : 'Einschränkung'
    },

    DependencyTab : {
        'Predecessors'                        : 'Vorgänger',
        'Successors'                          : 'Nachfolger',
        'ID'                                  : 'ID',
        'Name'                                : 'Name',
        'Type'                                : 'Typ',
        'Lag'                                 : 'Verzögern',
        'Cyclic dependency has been detected' : 'Die zyklische Abhängigkeit wurde erkannt'
    },

    ResourcesTab : {
        unitsTpl    : ({ value }) => `${value}%`,
        'Resources' : 'Resourcen',
        'Resource'  : 'Resource',
        'Units'     : 'Einheiten'
    },

    NotesTab : {
        'Notes' : 'Notizen'
    },

    SchedulingModePicker : {
        'Normal'         : 'Normal',
        'Fixed Duration' : 'Feste Dauer',
        'Fixed Units'    : 'Feste Einheiten',
        'Fixed Effort'   : 'Feste Arbeit'
    },

    //endregion

    //region Columns

    TemplateColumn : {
        noTemplate : 'TemplateColumn braucht eine template',
        noFunction : 'TemplateColumn.template muss eine funktion sein'
    },

    ColumnStore : {
        columnTypeNotFound : function(data) {
            return 'Spalte typ ' + data.type + 'nicht registriert';
        }
    },

    //endregion

    //region Mixins

    InstancePlugin : {
        fnMissing : function(data) {
            return 'Trying to chain fn ' + data.plugIntoName + '#' + data.fnName + ', but plugin fn ' + data.pluginName + '#' + data.fnName + ' does not exist';
        },
        overrideFnMissing : function(data) {
            return 'Trying to override fn ' + data.plugIntoName + '#' + data.fnName + ', but plugin fn ' + data.pluginName + '#' + data.fnName + ' does not exist';
        }
    },

    //endregion

    //region Features

    ColumnPicker : {
        columnsMenu     : 'Spalten',
        hideColumn      : 'Versteck spalte',
        hideColumnShort : 'Versteck'
    },

    Filter : {
        applyFilter  : 'Filter anwenden',
        filter       : 'Filter',
        editFilter   : 'Filter redigieren',
        on           : 'Auf',
        before       : 'Vor',
        after        : 'Nach',
        equals       : 'Gleichen',
        lessThan     : 'Weniger als',
        moreThan     : 'Mehr als',
        removeFilter : 'Filter entfernen'
    },

    FilterBar : {
        enableFilterBar  : 'Filterleiste anzeigen',
        disableFilterBar : 'Filterleiste ausblenden'
    },

    Group : {
        groupAscending       : 'Aufsteigend gruppieren',
        groupDescending      : 'Absteigend gruppieren',
        groupAscendingShort  : 'Aufsteigend',
        groupDescendingShort : 'Absteigend',
        stopGrouping         : 'Stoppen gruppierung',
        stopGroupingShort    : 'Stoppen'
    },

    Search : {
        searchForValue : 'Suche nach Wert'
    },

    Sort : {
        'sortAscending'          : 'Aufsteigend sortierung',
        'sortDescending'         : 'Absteigend sortierung',
        'multiSort'              : 'Multi sortieren',
        'removeSorter'           : 'Sortierung entfernen',
        'addSortAscending'       : 'Aufsteigend sortieren hinzufügen',
        'addSortDescending'      : 'Absteigend sortieren hinzufügen',
        'toggleSortAscending'    : 'Ändern Sie auf aufsteigend',
        'toggleSortDescending'   : 'Zu absteigend wechseln',
        'sortAscendingShort'     : 'Aufsteigend',
        'sortDescendingShort'    : 'Absteigend',
        'removeSorterShort'      : 'Entfernen',
        'addSortAscendingShort'  : '+ Aufsteigend',
        'addSortDescendingShort' : '+ Absteigend'
    },

    Tree : {
        noTreeColumn : 'To use the tree feature one column must be configured with tree: true'
    },

    //endregion

    //region Grid

    Grid : {
        featureNotFound : function(data) {
            return 'Feature "' + data + '" not available, make sure you have imported it';
        },
        invalidFeatureNameFormat : function(data) {
            return 'Invalid feature name "' + data + '", must start with a lowercase letter';
        },
        removeRow         : 'Zeile löschen',
        removeRows        : 'Zeilen löschen',
        loadMask          : 'Laden...',
        loadFailedMessage : 'Wird geladen, bitte versuche es erneut'
    },

    //endregion

    //region Widgets

    Field : {
        invalidValue          : 'Ungültiger Feldwert',
        minimumValueViolation : 'Mindestwertverletzung',
        maximumValueViolation : 'Maximalwertverletzung',
        fieldRequired         : 'Dieses Feld wird benötigt',
        validateFilter        : 'Der Wert muss aus der Liste ausgewählt werden'
    },

    DateField : {
        invalidDate : 'Ungültige Datumseingabe'
    },

    TimeField : {
        invalidTime : 'Ungültige Zeitangabe'
    },

    //endregion

    //region Others

    DateHelper : {
        shortWeek    : 'W',
        shortQuarter : 'Q',
        locale       : 'de-DE',
        week         : 'Woche',
        weekStartDay : 1,
        unitNames    : [
            { single : 'Millisekunde', plural : 'Millisekunden', abbrev : 'ms' },
            { single : 'Sekunde', plural : 'Sekunden', abbrev : 's' },
            { single : 'Minute', plural : 'Minuten', abbrev : 'min' },
            { single : 'Stunde', plural : 'Stunden', abbrev : 'std' },
            { single : 'Tag', plural : 'Tage', abbrev : 't' },
            { single : 'Woche', plural : 'Wochen', abbrev : 'W' },
            { single : 'Monat', plural : 'Monathe', abbrev : 'mon' },
            { single : 'Quartal', plural : 'Quartal', abbrev : 'Q' },
            { single : 'Jahr', plural : 'Jahre', abbrev : 'jahr' }
        ],
        // Used to build a RegExp for parsing time units.
        // The full names from above are added into the generated Regexp.
        // So you may type "2 v" or "2 ve" or "2 vecka" or "2 vecka" into a DurationField.
        // When generating its display value though, it uses the full localized names above.
        unitAbbreviations : [
            ['ms', 'mil'],
            ['s', 'sek'],
            ['m', 'min'],
            ['h', 'std'],
            ['t'],
            ['w', 'wo'],
            ['mo', 'mon'],
            ['q'],
            []
        ]
    },

    BooleanCombo : {
        'Yes' : 'Ja',
        'No'  : 'Nein'
    },

    //endregion

    //region Scheduler

    ExcelExporter : {
        'No resource assigned' : 'Keine Ressource zugewiesen'
    },

    Dependencies : {
        from     : 'Von',
        to       : 'Zo',
        valid    : 'Gültig',
        invalid  : 'Ungültig',
        Checking : 'Überprüfung…'
    },

    DependencyEdit : {
        From              : 'Von',
        To                : 'Zu',
        Type              : 'Typ',
        Lag               : 'Verzögern',
        'Edit dependency' : 'Abhängigkeit bearbeiten',

        Save         : 'Speichern',
        Delete       : 'Löschen',
        Cancel       : 'Abbrechen',
        StartToStart : 'Anfang-Anfang',
        StartToEnd   : 'Anfang-Ende',
        EndToStart   : 'Ende-Anfang',
        EndToEnd     : 'Ende-Ende'
    },

    EventEdit : {
        Name         : 'Name',
        Resource     : 'Ressource',
        Start        : 'Start',
        End          : 'Ende',
        Save         : 'Speichern',
        Delete       : 'Löschen',
        Cancel       : 'Abbrechen',
        'Edit Event' : 'Buchung redigieren'
    },

    Scheduler : {
        'Add event'      : 'Ereignis hinzufügen',
        'Delete event'   : 'Buchung löschen',
        'Unassign event' : 'Ereignis nicht zuordnen'
    },

    HeaderContextMenu : {
        pickZoomLevel   : 'Zoomen',
        activeDateRange : 'Datumsbereich',
        startText       : 'Anfangsdatum',
        endText         : 'Endtermin',
        todayText       : 'Heute'
    },

    EventFilter : {
        filterEvents : 'Aufgaben filtern',
        byName       : 'Namentlich'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Aktuelle Zeitleiste anzeigen'
    },

    //endregion

    //region Examples

    Column : {
        'Name'            : 'Name',
        'Age'             : 'Alter',
        'City'            : 'Stadt',
        'Food'            : 'Essen',
        'Color'           : 'Farbe',
        'First name'      : 'Vorname',
        'Surname'         : 'Nachname',
        'Team'            : 'Team',
        'Score'           : 'Ergebnis',
        'Rank'            : 'Rang',
        'Percent'         : 'Prozent',
        'Birthplace'      : 'Geburstort',
        'Start'           : 'Anfang',
        'Finish'          : 'Ende',
        'Template'        : 'Vorlage (template)',
        'Date'            : 'Datum',
        'Check'           : 'Check',
        'Contact'         : 'Kontakt',
        'Favorites'       : 'Favoriten',
        'Customer#'       : 'Kunde#',
        'When'            : 'Wann',
        'Brand'           : 'Marke',
        'Model'           : 'Modell',
        'Personal best'   : 'Persönlicher rekord',
        'Current rank'    : 'Aktueller rang',
        'Hometown'        : 'Heimatstadt',
        'Satisfaction'    : 'Zufriedenheit',
        'Favorite color'  : 'Lieblingsfarbe',
        'Rating'          : 'Wertung',
        'Cooks'           : 'Zuberaiten',
        'Birthday'        : 'Geburstag',
        'Staff'           : 'Personal',
        'Machines'        : 'Maschinen',
        'Type'            : 'Typ',
        'Task color'      : 'Aufgabe farbe',
        'Employment type' : 'Beschäftigungsverhältnis',
        'Capacity'        : 'Kapazität',
        'Production line' : 'Fließband',
        'Company'         : 'Firma',
        'End'             : 'Ende'
    },

    Shared : {
        'Locale changed' : 'Sprache geändert'
    }

    //endregion

};
