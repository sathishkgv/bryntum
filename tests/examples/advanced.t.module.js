describe('Test buttons', function(t) {

    const
        gantt = bryntum.query('gantt'),
        tools = bryntum.fromElement(document.querySelector('.b-top-toolbar')).widgetMap;

    !gantt.features.taskTooltip.isDestroyed && gantt.features.taskTooltip.destroy();

    t.it('Check toolbar buttons', (t) => {

        t.willFireNTimes(gantt, 'zoomchange', 3);
        t.willFireNTimes(gantt, 'timeaxischange', 5);

        t.chain(
            { click : tools.addTaskButton.element },

            { waitForSelector : 'input:focus' },

            // Create task with name foo
            { type : 'foo[ENTER]' },

            // Open task editor
            { click : tools.editTaskButton.element },

            // rename task to bar
            { type : '[BACKSPACE][BACKSPACE][BACKSPACE]bar', target : '[name=\'name\']' },

            { click : '.b-gantt-taskeditor :textEquals(Save)' },

            (next) => {
                t.selectorNotExists('.b-grid-cell:textEquals(foo)');
                t.selectorExists('.b-grid-cell:textEquals(bar)');
                next();
            },

            { click : tools.collapseAllButton.element },

            (next) => {
                t.is(gantt.taskStore.find(task => !task.isLeaf && task.parent === gantt.taskStore.rootNode && task.isExpanded(gantt.taskStore)), null, 'No expanded nodes found');
                next();
            },

            { click : tools.expandAllButton.element },

            (next) => {
                t.is(gantt.taskStore.find(task => !task.isLeaf && task.parent === gantt.taskStore.rootNode && !task.isExpanded(gantt.taskStore)), null, 'No collapsed nodes found');
                next();
            },

            // These should trigger 1 timeaxischange each
            { click : tools.zoomInButton.element },

            { click : tools.zoomOutButton.element },

            { click : tools.zoomToFitButton.element },

            { click : tools.previousButton.element },

            { click : tools.nextButton.element },

            { click : tools.settingsButton.element }
        );
    });

    t.it('Should support turning features on and off', (t) => {
        t.chain(
            { click : tools.featuresButton.element },
            // dependencies
            { click : '.b-menu-text:textEquals(Draw dependencies)' },
            { waitForSelectorNotFound : '.b-sch-dependency' },
            { click : '.b-menu-text:textEquals(Draw dependencies)' },
            { waitForSelector : '.b-sch-dependency' },
            // eof dependencies

            // labels
            { click : '.b-menu-text:textEquals(Task labels)' },
            { waitForSelectorNotFound : '.b-gantt-task-wrap:not(.b-sch-released).b-sch-label' },
            { click : '.b-menu-text:textEquals(Task labels)' },
            { waitForSelector : '.b-gantt-task-wrap .b-sch-label' },
            // eof labels

            // project lines
            { click : '.b-menu-text:textEquals(Project lines)' },
            { waitForSelectorNotFound : '.b-gantt-project-line:textEquals(Project start)' },
            { click : '.b-menu-text:textEquals(Project lines)' },
            { waitForSelector : '.b-gantt-project-line:textEquals(Project start)' },
            // eof project lines

            // non-working time
            { click : '.b-menu-text:textEquals(Highlight non-working time)' },
            { waitForSelectorNotFound : '.b-sch-nonworkingtime' },
            { click : '.b-menu-text:textEquals(Highlight non-working time)' },
            { waitForSelector : '.b-sch-nonworkingtime' },
            // eof non-working time

            // Enable cell editing
            { click : '.b-menu-text:textEquals(Enable cell editing)' },
            { waitForSelectorNotFound : '.b-gantt-task-wrap:not(.b-sch-released).b-sch-label' },
            { click : '.b-menu-text:textEquals(Enable cell editing)' },
            { waitForSelector : '.b-gantt-task-wrap .b-sch-label' },
            // eof cell editing

            // Show baselines
            { click : '.b-menu-text:textEquals(Show baselines)' },
            { waitForSelector : '.b-show-baselines' },
            { click : '.b-menu-text:textEquals(Show baselines)' },
            { waitForSelectorNotFound : '.b-show-baselines' },
            // eof Show baselines

            // schedule collapsing
            { click : '.b-menu-text:textEquals(Hide schedule)' },
            async() => t.ok(gantt.subGrids.normal.collapsed, 'Schedule collapsed'),
            { click : '.b-menu-text:textEquals(Hide schedule)' },
            async() => t.notOk(gantt.subGrids.normal.isCollapsed, 'Schedule expanded')
            // eof schedule collapsing
        );
    });

    t.it('Should support turning critical paths on and off', (t) => {
        t.chain(
            { click : tools.criticalPathsButton.element },
            { waitForSelector : '.b-gantt-critical-paths' },
            { click : tools.criticalPathsButton.element },
            { waitForSelectorNotFound : '.b-gantt-critical-paths' }
        );
    });
});
