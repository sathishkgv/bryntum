declare module "bryntum-gantt" {

    export abstract class Base {
        
        // properties
        config: object;
        // functions
        constructor(args: any);
        construct(config?: object): void;
        destroy(): void;
        callback(handler: string|Function, thisObj: object, args: Array<any>): void;
        setConfig(config: object): void;
    }

    export class BryntumWidgetAdapter {
        
        
        
    }

    export class AjaxStore extends Store {
        
        // properties
        isCommitting: boolean;
        isLoading: boolean;
        // functions
        load(params: object): Promise<any>;
        loadChildren(parentRecord: Model): Promise<any>;
        commit(): Promise<any>;
    }

    export class Model implements TreeNode, ModelStm {
        
        // properties
        static autoExposeFields: boolean;
        static childrenField: string;
        static convertEmptyParentToLeaf: boolean;
        static fieldMap: object;
        static fields: Array<any>;
        static idField: string;
        static parentIdField: string;
        allChildren: Array<any>;
        childLevel: number;
        children: Array<any>;
        descendantCount: number;
        fieldNames: Array<any>;
        firstChild: Model;
        firstStore: Store;
        hasGeneratedId: boolean;
        id: string|number;
        internalId: number;
        isBatchUpdating: boolean;
        isCommitting: boolean;
        isLeaf: boolean;
        isLoaded: boolean;
        isModified: boolean;
        isParent: boolean;
        isPhantom: boolean;
        isValid: boolean;
        json: string;
        lastChild: Model;
        modifications: object;
        previousSiblingsTotalCount: number;
        visibleDescendantCount: number;
        // functions
        constructor(data?: object, store?: Store, meta?: object);
        static getFieldDefinition(fieldName: string): object;
        getDataSource(fieldName: string): string;
        static processField(fieldName: string, value: any): any;
        get(fieldName: string): any;
        set(field: string|object, value: any, silent?: boolean): void;
        generateId(): void;
        static asId(model: Model|string|number): string|number;
        beginBatch(): void;
        endBatch(silent?: boolean): void;
        cancelBatch(): void;
        copy(newId?: number|string|object): Model;
        remove(silent?: boolean): void;
        ancestorsExpanded(): void;
        isExpanded(store: Store): void;
        getDescendantCount(onlyVisible?: boolean, store?: Store): number;
        traverse(fn: any): void;
        traverseBefore(fn: any): void;
        traverseWhile(fn: Function): boolean;
        bubble(fn: Function): void;
        bubbleWhile(fn: Function): boolean;
        contains(child: Model|string|number): boolean;
        appendChild(childRecord: Model|Array<any>): Model;
        insertChild(childRecord: Model|Array<any>, before: Model): Model;
        removeChild(childRecords: Model|Array<any>, isMove?: boolean): void;
    }

    export class Store extends Base implements StoreChained, StoreCRUD, StoreFilter, StoreGroup, StoreSearch, StoreSort, StoreSum, StoreTree, Events, StoreStm {
        
        // properties
        static stores: Array<any>;
        autoCommit: boolean;
        changes: object;
        count: number;
        data: Array<any>;
        filters: Collection;
        first: Model;
        groupers: Array<any>;
        id: string|number;
        isChained: boolean;
        isFiltered: boolean;
        isGrouped: boolean;
        isSorted: boolean;
        isTree: boolean;
        last: Model;
        leaves: Array<any>;
        modelClass: { new(data: object): Model };
        originalCount: number;
        records: Array<any>;
        rootNode: Model;
        sorters: Array<any>;
        // functions
        beginBatch(): void;
        endBatch(): void;
        static getStore(id: string|number|Array<any>): Store;
        getRange(start?: number, end?: number): Array<any>;
        createRecord(data: any, skipExpose?: any): void;
        getCount(countProcessed?: any): number;
        getAt(index: number): Model;
        getById(id: Model|string|number): Model;
        isVisible(recordOrId: Model|string|number): boolean;
        getByInternalId(internalId: number): Model;
        includes(recordOrId: Model|string|number): boolean;
        indexOf(recordOrId: Model|string|number, visibleRecords?: boolean): number;
        getDistinctValues(field: any): Array<any>;
        getValueCount(field: any, value: any): number;
        forEach(fn: Function, thisObj: object): void;
        map(fn: Function): Array<any>;
        reduce(fn: Function, initialValue: any): any;
        traverse(fn: Function): void;
        getNext(recordOrId: any, wrap?: boolean): Model;
        getPrev(recordOrId: any, wrap?: boolean): Model;
        makeChained(chainedFilterFn: Function, chainedFields: Array<any>, config: object): StoreChained;
        remove(records: string|Array<any>|number|Array<any>|Model|Array<any>, silent?: boolean): Array<any>;
        removeAll(silent: any): void;
        add(records: Model|Array<any>|object|Array<any>, silent?: boolean): Array<any>;
        insert(index: any, records: any): Array<any>;
        move(item: object, beforeItem: object): void;
        commit(): object;
        applyChangesFromStore(otherStore: Store): void;
        filter(field: string|object|Array<any>|Function, value: any): void;
        filterBy(fn: Function): void;
        clearFilters(): void;
        group(field: string, ascending: boolean, add?: boolean, performSort?: boolean, silent?: boolean): void;
        clearGroupers(): void;
        isRecordInGroup(record: Model, groupValue: any): boolean;
        getGroupRecords(groupValue: any): Array<any>;
        getGroupTitles(): Array<any>;
        sort(field: string|object, ascending: boolean, add?: boolean, silent?: boolean): void;
        search(find: any, fields: Array<any>): any;
        findByField(field: any, value: any): any;
        find(fn: Function): Model;
        findRecord(fieldName: string, value: any): Model;
        query(fn: any): Array<any>;
        some(fn: any): boolean;
        addSorter(field: string|object, ascending?: boolean): void;
        removeSorter(field: any): void;
        clearSorters(): void;
        createSorterFn(sorters: any): Function;
        sum(field: string, records: Array<any>): number;
        min(field: string, records: Array<any>): number;
        max(field: string, records: Array<any>): number;
        average(field: string, records: Array<any>): number;
        groupSum(groupValue: any, field: string): number;
        loadChildren(parentRecord: Model): void;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        on(config: any, thisObj?: any): void;
        un(config: any, thisObj: any): void;
        removeListener(config: object, thisObj: object): void;
        hasListener(eventName: string): boolean;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        trigger(eventName: string, param: object): boolean;
        suspendEvents(queue?: boolean): void;
        resumeEvents(): void;
    }

    export class StoreCRUD {
        
        // properties
        autoCommit: boolean;
        changes: object;
        // functions
        remove(records: string|Array<any>|number|Array<any>|Model|Array<any>, silent?: boolean): Array<any>;
        removeAll(silent: any): void;
        add(records: Model|Array<any>|object|Array<any>, silent?: boolean): Array<any>;
        insert(index: any, records: any): Array<any>;
        move(item: object, beforeItem: object): void;
        commit(): object;
        applyChangesFromStore(otherStore: Store): void;
    }

    export class StoreChained {
        
        // properties
        isChained: boolean;
        
    }

    export class StoreFilter {
        
        // properties
        filters: Collection;
        isFiltered: boolean;
        // functions
        filter(field: string|object|Array<any>|Function, value: any): void;
        filterBy(fn: Function): void;
        clearFilters(): void;
    }

    export class StoreGroup {
        
        // properties
        groupers: Array<any>;
        isGrouped: boolean;
        // functions
        group(field: string, ascending: boolean, add?: boolean, performSort?: boolean, silent?: boolean): void;
        clearGroupers(): void;
        isRecordInGroup(record: Model, groupValue: any): boolean;
        getGroupRecords(groupValue: any): Array<any>;
        getGroupTitles(): Array<any>;
        sort(field: any, ascending: any, add: any, quiet: any): void;
    }

    export class StoreSearch {
        
        
        // functions
        search(find: any, fields: Array<any>): any;
        findByField(field: any, value: any): any;
        find(fn: Function): Model;
        findRecord(fieldName: string, value: any): Model;
        query(fn: any): Array<any>;
        some(fn: any): boolean;
    }

    export class StoreSort {
        
        // properties
        isSorted: boolean;
        sorters: Array<any>;
        // functions
        sort(field: string|object, ascending: boolean, add?: boolean, silent?: boolean): void;
        addSorter(field: string|object, ascending?: boolean): void;
        removeSorter(field: any): void;
        clearSorters(): void;
        createSorterFn(sorters: any): Function;
    }

    export class StoreSum {
        
        
        // functions
        sum(field: string, records: Array<any>): number;
        min(field: string, records: Array<any>): number;
        max(field: string, records: Array<any>): number;
        average(field: string, records: Array<any>): number;
        groupSum(groupValue: any, field: string): number;
    }

    export class StoreTree {
        
        // properties
        isTree: boolean;
        leaves: Array<any>;
        // functions
        loadChildren(parentRecord: Model): void;
    }

    export class TreeNode {
        
        // properties
        allChildren: Array<any>;
        childLevel: number;
        children: Array<any>;
        descendantCount: number;
        firstChild: Model;
        isLeaf: boolean;
        isLoaded: boolean;
        isParent: boolean;
        lastChild: Model;
        previousSiblingsTotalCount: number;
        visibleDescendantCount: number;
        // functions
        ancestorsExpanded(): void;
        isExpanded(store: Store): void;
        getDescendantCount(onlyVisible?: boolean, store?: Store): number;
        traverse(fn: any): void;
        traverseBefore(fn: any): void;
        traverseWhile(fn: Function): boolean;
        bubble(fn: Function): void;
        bubbleWhile(fn: Function): boolean;
        contains(child: Model|string|number): boolean;
        appendChild(childRecord: Model|Array<any>): Model;
        insertChild(childRecord: Model|Array<any>, before: Model): Model;
        removeChild(childRecords: Model|Array<any>, isMove?: boolean): void;
    }

    export class StateTrackingManager {
        
        // properties
        autoRecord: boolean;
        canRedo: boolean;
        canUndo: boolean;
        disabled: boolean;
        isReady: boolean;
        isRecording: boolean;
        isRestoring: boolean;
        length: number;
        position: number;
        queue: Array<any>;
        state: StateBase;
        stores: Array<any>;
        transaction: Transaction;
        // functions
        hasStore(store: Store): boolean;
        addStore(store: Store): void;
        removeStore(store: Store): void;
        getStoreById(id: string|number): Store;
        forEachStore(fn: Function): void;
        enable(): void;
        disable(): void;
        startTransaction(title?: string): void;
        stopTransaction(title?: string): void;
        rejectTransaction(): void;
        undo(steps?: number): void;
        undoAll(): void;
        redo(steps?: number): void;
        redoAll(): void;
        resetQueue(): void;
        resetUndoQueue(): void;
        resetRedoQueue(): void;
    }

    export class Transaction {
        
        // properties
        length: number;
        queue: Array<any>;
        // functions
        addAction(action: ActionBase|object): void;
        undo(): void;
        redo(): void;
    }

    export abstract class ActionBase {
        
        // properties
        type: string;
        // functions
        undo(): void;
        redo(): void;
    }

    export class AddAction {
        
        
        
    }

    export class InsertAction {
        
        
        
    }

    export class InsertChildAction {
        
        
        
    }

    export class RemoveAction {
        
        
        
    }

    export class RemoveAllAction {
        
        
        
    }

    export class UpdateAction {
        
        
        
    }

    export class ModelStm {
        
        
        
    }

    export class StoreStm {
        
        
        
    }

    export abstract class StateBase {
        
        
        
    }

    export class AjaxHelper {
        
        
        // functions
        static get(url: string, options?: object): Promise<any>;
        static post(url: string, payload: string|object|FormData, options: object): Promise<any>;
        static fetch(url: string, options: object): Promise<any>;
    }

    export class DateHelper {
        
        // properties
        static weekStartDay: any;
        // functions
        static parse(dateString: string, format: string): Date;
        static create(definition: object): Date;
        static format(date: Date, format: string): string;
        static asMilliseconds(amount: number|string, unit: string): number;
        static formatDelta(delta: number, abbrev?: boolean): void;
        static as(toUnit: any, amount: any, fromUnit?: any): number;
        static is24HourFormat(format: string): boolean;
        static add(date: Date, amount: number, unit?: string): Date;
        static diff(start: Date, end: Date, unit?: string, fractional?: boolean): number;
        static startOf(date: Date, unit?: string, clone?: boolean): Date;
        static clone(date: Date): Date;
        static clearTime(date: Date, clone?: boolean): Date;
        static set(date: Date, unit: string|object, amount: number): Date;
        static constrain(date: Date, min: Date, max: Date): Date;
        static getTime(hours: number, minutes?: number, seconds?: number): Date;
        static isBefore(first: any, second: any): boolean;
        static isAfter(first: any, second: any): boolean;
        static isEqual(first: any, second: any, unit: any): boolean;
        static compare(first: Date, second: Date, unit: string): number;
        static isStartOf(date: Date, unit: string): boolean;
        static betweenLesser(date: Date, start: Date, end: Date): boolean;
        static betweenLesserEqual(date: Date, start: Date, end: Date): boolean;
        static intersectSpans(date1Start: Date, date1End: Date, date2Start: Date, date2End: Date): boolean;
        static compareUnits(unit1: string, unit2: string): void;
        static timeSpanContains(spanStart: Date, spanEnd: Date, otherSpanStart: Date, otherSpanEnd: Date): boolean;
        static get(date: Date, unit: string): void;
        static daysInMonth(date: Date): number;
        static getFirstDateOfMonth(date: Date): Date;
        static getLastDateOfMonth(date: Date): Date;
        static min(first: Date, second: Date): Date;
        static max(first: Date, second: Date): Date;
        static getNext(date: Date, unit: string, increment?: number, weekStartDay?: number): Date;
        static getStartOfNextDay(date: Date, clone: boolean, noNeedToClearTime: boolean): Date;
        static getEndOfPreviousDay(date: Date, noNeedToClearTime: boolean): Date;
        static formatCount(count: number, unit: string): string;
        static getUnitToBaseUnitRatio(baseUnit: string, unit: string, acceptEstimate?: boolean): number;
        static getMeasuringUnit(unit: any): any;
        static getShortNameOfUnit(unit: string): string;
        static getLocalizedNameOfUnit(unit: string, plural: boolean): string;
        static normalizeUnit(unit: string): string;
        static getDurationInUnit(start: Date, end: Date, unit: string): number;
        static parseDuration(value: string, allowDecimals?: boolean, defaultUnit?: string): object;
        static parseTimeUnit(unitName: any): void;
    }

    export class DomHelper {
        
        // properties
        static activeElement: HTMLElement;
        static scrollBarWidth: number;
        static themeInfo: object;
        // functions
        static isFocusable(element: HTMLElement): void;
        static isInView(element: HTMLElement, whole: boolean): void;
        static isCustomElement(element: HTMLElement): boolean;
        static elementFromPoint(x: number, y: number): HTMLElement;
        static getId(element: HTMLElement): void;
        static setLength(element: string|HTMLElement, style?: string, value?: number|string): string;
        static getChild(element: HTMLElement, selector: string): HTMLElement;
        static hasChild(element: HTMLElement, selector: string): boolean;
        static children(element: HTMLElement, selector: string): Array<any>;
        static down(element: HTMLElement, selector: string): HTMLElement;
        static isDescendant(parentElement: HTMLElement, childElement: HTMLElement): boolean;
        static forEachSelector(element: HTMLElement, selector: string, fn: Function): void;
        static forEachChild(element: HTMLElement, fn: Function): void;
        static removeEachSelector(element: HTMLElement, selector: string): void;
        static up(element: HTMLElement, selector: string): HTMLElement;
        static makeValidId(id: string): string;
        static createElement(config: object, returnAll?: boolean): HTMLElement|Array<any>|object;
        static insertFirst(into: HTMLElement, element: HTMLElement): HTMLElement;
        static insertBefore(into: HTMLElement, element: HTMLElement, beforeElement: HTMLElement): HTMLElement;
        static append(parentElement: HTMLElement, elementOrConfig: HTMLElement|object|string): HTMLElement;
        static getTranslateX(element: HTMLElement): number;
        static getTranslateY(element: HTMLElement): number;
        static getTranslateXY(element: HTMLElement): Array<any>;
        static getOffsetX(element: HTMLElement, container: HTMLElement): number;
        static getOffsetY(element: HTMLElement, container: HTMLElement): number;
        static getOffsetXY(element: HTMLElement, container: HTMLElement): Array<any>;
        static focusWithoutScrolling(element: HTMLElement): void;
        static getPageX(element: HTMLElement): number;
        static getPageY(element: HTMLElement): number;
        static setTranslateX(element: HTMLElement, x: number): void;
        static setTranslateY(element: HTMLElement, y: number): void;
        static setTop(element: HTMLElement, y: number|string): void;
        static setLeft(element: HTMLElement, x: number|string): void;
        static setTranslateXY(element: HTMLElement, x?: number, y?: number): void;
        static addTranslateX(element: HTMLElement, x: number): void;
        static addTranslateY(element: HTMLElement, y: number): void;
        static addLeft(element: HTMLElement, x: any): void;
        static addTop(element: HTMLElement, y: any): void;
        static getStyleValue(element: HTMLElement, propName: string|Array<any>, inline?: boolean): string|object;
        static applyStyle(element: HTMLElement, style: string|object): void;
        static addClasses(element: HTMLElement, classes: Array<any>): void;
        static removeClasses(element: HTMLElement, classes: Array<any>): void;
        static toggleClasses(element: HTMLElement, classes: Array<any>, force?: boolean): void;
        static highlight(element: Rectangle): void;
        static resetScrollBarWidth(): void;
        static measureText(text: string, sourceElement: HTMLElement): number;
        static measureSize(size: string, sourceElement: HTMLElement): number;
        static sync(stringOrElement: string|HTMLElement, targetElement: HTMLElement): void;
        static syncClassList(element: HTMLElement, newClasses: Array<any>|string|object): void;
        static setTheme(newThemeName: string): Promise<any>;
    }

    export class DragHelper extends Base implements Events {
        
        
        // functions
        constructor(config: object);
        abort(): void;
        createProxy(): void;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        on(config: any, thisObj?: any): void;
        un(config: any, thisObj: any): void;
        removeListener(config: object, thisObj: object): void;
        hasListener(eventName: string): boolean;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        trigger(eventName: string, param: object): boolean;
        suspendEvents(queue?: boolean): void;
        resumeEvents(): void;
    }

    export class EventHelper {
        
        // properties
        static dblClickTime: number;
        static longPressTime: number;
        // functions
        static getXY(event: Event): Array<any>;
        static getDistanceBetween(event1: Event, event2: Event): number;
        static getPagePoint(event: Event): Point;
        static getClientPoint(event: Event): Point;
        static addListener(element: HTMLElement, eventName: string|object, handler?: Function, options?: object): Function;
        static on(options: object): Function;
    }

    export class StringHelper {
        
        
        // functions
        static capitalizeFirstLetter(string: any): string;
        static lowercaseFirstLetter(string: any): string;
        static hyphenate(string: any): string;
        static safeJsonParse(string: string): object;
        static safeJsonStringify(object: object): object;
        static createId(inString: any): string;
    }

    export class WidgetHelper {
        
        // properties
        static adapter: any;
        static hasAdapter: boolean;
        // functions
        static getById(id: any): Widget;
        static fromElement(element: HTMLElement|Event, type?: string|Function, limit?: HTMLElement|number): any;
        static createWidget(config: any): object;
        static append(widget: object|Array<any>, config?: HTMLElement|string|object): Array<any>;
        static openPopup(element: any, config: any): any|object;
        static showContextMenu(element: HTMLElement|Array<any>, config: object): any|object;
        static attachTooltip(element: any, configOrText: any): object;
        static hasTooltipAttached(element: any): boolean;
        static destroyTooltipAttached(element: any): void;
        static mask(element: any, msg: any): void;
        static unmask(element: any): void;
        static toast(msg: string): void;
    }

    export class DomClassList {
        
        
        // functions
        clone(): DomClassList;
        trim(): string;
        isEqual(other: DomClassList|string): boolean;
        add(classes: string): void;
        remove(classes: string): void;
        split(): Array<any>;
    }

    export class Fullscreen {
        
        // properties
        static enabled: boolean;
        static isFullscreen: boolean;
        // functions
        static request(element: HTMLElement): void;
        static exit(): void;
        static onFullscreenChange(fn: Function): void;
        static unFullscreenChange(fn: Function): void;
    }

    export class Point extends Rectangle {
        
        
        // functions
        constrain(into: Rectangle): void;
    }

    export class RandomGenerator {
        
        
        // functions
        nextRandom(max: any): number;
        reset(): void;
        fromArray(array: any): any;
    }

    export class Rectangle {
        
        // properties
        bottom: number;
        center: Point;
        height: number;
        left: number;
        right: number;
        top: number;
        width: number;
        x: number;
        y: number;
        // functions
        static from(element: HTMLElement, relativeTo?: HTMLElement, ignorePageScroll?: boolean): Rectangle;
        static inner(element: any, relativeTo?: HTMLElement, ignorePageScroll?: boolean): Rectangle;
        static content(element: any, relativeTo?: HTMLElement, ignorePageScroll?: boolean): Rectangle;
        static client(element: any, relativeTo?: HTMLElement, ignorePageScroll?: boolean): Rectangle;
        static union(rectangles: Array<any>): Rectangle;
        clone(): void;
        contains(other: any): boolean;
        intersect(other: Rectangle, useBoolean?: boolean): Rectangle|boolean;
        translate(x: number, y: number): void;
        moveTo(x: number, y: number): void;
        getDelta(other: Point): void;
        adjust(x: number, y: number, width: number, height: number): void;
        inflate(amount: number): Rectangle;
        constrainTo(constrainTo: Rectangle, strict: boolean): void;
        alignTo(spec: object): Rectangle;
        getAlignmentPoint(alignmentPoint: string, offsets: Array<any>): void;
        highlight(): void;
    }

    export class Scroller extends Base {
        
        // properties
        clientHeight: number;
        clientWidth: number;
        id: string;
        maxX: number;
        maxY: number;
        overflowX: boolean|string;
        overflowY: boolean|string;
        scrollHeight: number;
        scrollWidth: number;
        viewport: Rectangle;
        x: number;
        y: number;
        // functions
        addPartner(otherScroller: Scroller, axes?: string|object): void;
        removePartner(otherScroller: Scroller): void;
        scrollIntoView(element: HTMLElement|Rectangle, options?: object): Promise<any>;
        scrollBy(xDelta?: number, yDelta?: number, options?: object|boolean): Promise<any>;
        scrollTo(toX?: number, toY?: number, options?: object|boolean): Promise<any>;
    }

    export class LocaleManager {
        
        // properties
        locale: string|object;
        // functions
        registerLocale(name: any, config: any): void;
        extendLocale(name: any, config: any): void;
        applyLocale(name: string): boolean|Promise<any>;
    }

    export class Localizable {
        
        // properties
        localeManager: LocaleManager;
        // functions
        L(text: string, templateData?: object): string;
    }

    export class Events {
        
        
        // functions
        addListener(config: object, thisObj?: object, prio?: number): Function;
        on(config: any, thisObj?: any): void;
        un(config: any, thisObj: any): void;
        removeListener(config: object, thisObj: object): void;
        hasListener(eventName: string): boolean;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        trigger(eventName: string, param: object): boolean;
        suspendEvents(queue?: boolean): void;
        resumeEvents(): void;
    }

    export class InstancePlugin implements Localizable, Events {
        
        // properties
        client: Widget;
        disabled: boolean;
        localeManager: LocaleManager;
        // functions
        L(text: string, templateData?: object): string;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        on(config: any, thisObj?: any): void;
        un(config: any, thisObj: any): void;
        removeListener(config: object, thisObj: object): void;
        hasListener(eventName: string): boolean;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        trigger(eventName: string, param: object): boolean;
        suspendEvents(queue?: boolean): void;
        resumeEvents(): void;
    }

    export class Override {
        
        
        // functions
        static apply(override: any): void;
    }

    export class Pluggable {
        
        // properties
        plugins: object;
        // functions
        addPlugins(plugins: any): void;
        hasPlugin(pluginClassOrName: any): boolean;
        getPlugin(pluginClassOrName: any): object;
    }

    export class State {
        
        // properties
        state: object;
        
    }

    export class Bag {
        
        // properties
        count: number;
        values: Array<any>;
        // functions
        get(id: any): object;
        add(toAdd: object|Array<any>): void;
        remove(toAdd: object|Array<any>): void;
        changeId(item: string|number|object, newId: string|number): void;
        includes(item: object|string|number): boolean;
        map(fn: Function, thisObj?: object): Array<any>;
        forEach(fn: Function, thisObj?: object): void;
    }

    export class ClickRepeater {
        
        
        
    }

    export class Collection {
        
        // properties
        allValues: Array<any>;
        count: number;
        filterFunction: Function;
        filters: Collection;
        generation: number;
        idProperty: string;
        isFiltered: boolean;
        isSorted: boolean;
        sortFunction: Function;
        sorters: Collection;
        totalCount: number;
        values: Array<any>;
        // functions
        clear(): void;
        forEach(fn: Function, ignoreFilters?: boolean): void;
        map(fn: Function, ignoreFilters?: boolean): Array<any>;
        find(fn: Function, ignoreFilters?: boolean): object;
        add(items: object): void;
        remove(items: object): void;
        move(item: object, beforeItem?: object): number;
        splice(index?: number, toRemove?: Array<any>|number, toAdd?: Array<any>|object): void;
        changeId(item: string|number|object, newId: string|number): void;
        get(id: any, ignoreFilters?: boolean): object;
        getBy(propertyName: string, value: any, ignoreFilters?: boolean): object;
        addSorter(sorter: object): CollectionSorter;
        addFilter(filter: object): CollectionFilter;
        findIndex(propertyName: string, value: any, ignoreFilters?: boolean): number;
        indexOf(item: object|string|number, ignoreFilters?: boolean): number;
        includes(item: object|string|number, ignoreFilters?: boolean): boolean;
    }

    export class CollectionFilter {
        
        // properties
        filterBy: Function;
        operator: string;
        property: string;
        value: any;
        
    }

    export class CollectionSorter {
        
        
        
    }

    export class Month {
        
        // properties
        dayCount: number;
        endDate: Date;
        startDate: Date;
        weekCount: number;
        // functions
        constructor(config: object);
        eachDay(fn: Function): void;
        eachWeek(fn: Function): void;
    }

    export class Button extends Widget implements Badge {
        
        // properties
        badge: string;
        icon: string;
        menu: Widget;
        pressed: boolean;
        text: string;
        // functions
        toggle(pressed: boolean): void;
    }

    export class ButtonGroup extends Container {
        
        
        
    }

    export class CalendarPanel {
        
        // properties
        date: Date;
        weekStartDay: any;
        
    }

    export class Checkbox extends Field {
        
        // properties
        checked: boolean;
        readOnly: boolean;
        text: string;
        value: string;
        // functions
        check(): void;
        uncheck(): void;
        toggle(): void;
    }

    export class ChipView extends List {
        
        
        
    }

    export class Combo extends PickerField {
        
        // properties
        static queryAll: symbol;
        static queryLast: symbol;
        hidePickerOnSelect: any;
        record: Array<any>;
        records: Array<any>;
        store: Store;
        value: object;
        valueCollection: any;
        
    }

    export class Container extends Widget {
        
        // properties
        items: Array<any>;
        layoutStyle: object;
        record: Model;
        widgetMap: any;
        // functions
        eachWidget(fn: Function, deep?: boolean): void;
        queryAll(filter: Function): Array<any>;
        query(filter: Function): Widget;
        getWidgetById(id: string): Widget;
        processWidgetConfig(): void;
    }

    export class DateField extends PickerField {
        
        // properties
        format: string;
        max: Date|string;
        min: Date|string;
        step: string|number|object;
        
    }

    export class DisplayField extends Field {
        
        
        
    }

    export class DurationField extends TextField {
        
        // properties
        milliseconds: number;
        value: string|number|object;
        
    }

    export class Editor extends Container {
        
        
        // functions
        startEdit(editObject: object): void;
        completeEdit(): void;
        cancelEdit(): void;
    }

    export abstract class Field extends Widget implements Badge {
        
        // properties
        static errorTip: Tooltip;
        badge: string;
        isEmpty: boolean;
        isEmptyInput: boolean;
        isValid: boolean;
        label: string;
        readOnly: boolean;
        triggers: object;
        value: any;
        // functions
        select(start?: number, end?: number): void;
        setError(error: string, silent?: boolean): void;
        clearError(error: string, silent?: boolean): void;
        getErrors(): Array<any>;
    }

    export class FlagField {
        
        
        
    }

    export class List extends Widget {
        
        // properties
        items: Array<any>;
        store: Store;
        
    }

    export class Mask {
        
        // properties
        text: string;
        // functions
        static mask(text: string|object, element: HTMLElement): Mask;
        static unmask(element: HTMLElement): Promise<any>;
        show(): void;
        hide(): Promise<any>;
        close(): Promise<any>;
    }

    export class Menu extends Popup {
        
        // properties
        currentSubMenu: Menu;
        isSubMenu: boolean;
        parentMenu: Menu;
        selectedElement: HTMLElement;
        
    }

    export class MenuItem extends Widget {
        
        // properties
        checked: boolean;
        menu: Widget;
        // functions
        doAction(): void;
    }

    export class NumberField extends Field {
        
        // properties
        max: number;
        min: number;
        
    }

    export class Panel extends Container {
        
        // properties
        tools: object;
        
    }

    export abstract class PickerField extends TextField {
        
        
        // functions
        togglePicker(): void;
        showPicker(): void;
        hidePicker(): void;
    }

    export class Popup extends Panel {
        
        
        // functions
        close(): void;
    }

    export class Slider extends Widget {
        
        // properties
        max: number;
        min: number;
        step: number;
        text: string;
        value: number;
        
    }

    export class TabPanel extends Widget {
        
        // properties
        activeIndex: number;
        activeItem: Widget;
        activeTab: Widget|number;
        
    }

    export class TextAreaField extends Field {
        
        
        
    }

    export class TextField extends Field {
        
        
        
    }

    export class TimeField extends PickerField {
        
        // properties
        format: string;
        max: Date|string;
        min: Date|string;
        step: string|number|object;
        value: Date|string;
        // functions
        showPicker(): void;
        focusPicker(): void;
    }

    export class Toast {
        
        
        // functions
        static show(msgOrConfig: string|object): Toast;
        hide(): void;
    }

    export class Tool extends Widget {
        
        
        
    }

    export class Toolbar extends Container {
        
        
        
    }

    export class Tooltip extends Widget {
        
        // properties
        static currentOverElement: HTMLElement;
        activeTarget: HTMLElement;
        html: string;
        textContent: any;
        
    }

    export class Widget extends Base implements Events, Localizable {
        
        // properties
        alignSelf: string;
        anchorSize: Array<any>;
        content: string;
        contentElement: HTMLElement;
        dataset: object;
        disabled: boolean;
        element: HTMLElement;
        flex: number|string;
        focusElement: HTMLElement;
        height: number|string;
        hidden: boolean;
        html: string;
        id: string;
        localeManager: LocaleManager;
        margin: number|string;
        maxHeight: string|number;
        maxWidth: string|number;
        minHeight: string|number;
        minWidth: string|number;
        owner: any;
        style: string|object|CSSStyleDeclaration;
        tooltip: string|object;
        visible: boolean;
        width: number|string;
        x: any;
        y: any;
        // functions
        alignTo(spec: object): void;
        toFront(): void;
        setXY(x?: number, y?: number): void;
        disable(): void;
        enable(): void;
        focus(): void;
        show(): Promise<any>;
        showBy(spec: object|HTMLElement): void;
        showByPoint(x: number|Array<any>, y?: number, options?: object): void;
        hide(): Promise<any>;
        up(selector: string|Function, deep?: boolean, limit?: number|string|Widget): void;
        owns(target: HTMLElement|Widget): void;
        revertFocus(): void;
        isFocused(): void;
        mask(msg: string|object): Mask;
        unmask(): void;
        parseTRBL(values: number|string|Array<any>, units?: string): void;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        on(config: any, thisObj?: any): void;
        un(config: any, thisObj: any): void;
        removeListener(config: object, thisObj: object): void;
        hasListener(eventName: string): boolean;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        trigger(eventName: string, param: object): boolean;
        suspendEvents(queue?: boolean): void;
        resumeEvents(): void;
        L(text: string, templateData?: object): string;
    }

    export class Card {
        
        // properties
        activeIndex: number;
        activeItem: Widget;
        // functions
        setActiveItem(activeItem: Widget|number): object;
    }

    export class Fit {
        
        
        
    }

    export class Layout {
        
        // properties
        containerCls: any;
        itemCls: any;
        
    }

    export class Badge {
        
        // properties
        badge: string;
        
    }

    export class AddNewColumn extends Column {
        
        
        
    }

    export class CalendarColumn extends Column {
        
        
        
    }

    export class ConstraintDateColumn extends GanttDateColumn {
        
        
        
    }

    export class ConstraintTypeColumn extends Column {
        
        
        
    }

    export class DependencyColumn extends Column {
        
        
        
    }

    export class DurationColumn extends NumberColumn {
        
        
        
    }

    export class EarlyEndDateColumn extends GanttDateColumn {
        
        
        
    }

    export class EarlyStartDateColumn extends GanttDateColumn {
        
        
        
    }

    export class EffortColumn extends DurationColumn {
        
        
        
    }

    export class EndDateColumn extends GanttDateColumn {
        
        
        
    }

    export abstract class GanttDateColumn extends DateColumn {
        
        
        
    }

    export class LateEndDateColumn extends GanttDateColumn {
        
        
        
    }

    export class LateStartDateColumn extends GanttDateColumn {
        
        
        
    }

    export class MilestoneColumn extends CheckColumn {
        
        
        
    }

    export class NameColumn extends TreeColumn {
        
        
        
    }

    export class NoteColumn extends Column {
        
        
        
    }

    export class PercentDoneColumn extends NumberColumn {
        
        
        
    }

    export class PredecessorColumn extends DependencyColumn {
        
        
        
    }

    export class ResourceAssignmentColumn extends Column {
        
        
        
    }

    export class SchedulingModeColumn extends Column {
        
        
        
    }

    export class SequenceColumn extends Column {
        
        
        
    }

    export class ShowInTimelineColumn extends CheckColumn {
        
        
        
    }

    export class StartDateColumn extends GanttDateColumn {
        
        
        
    }

    export class SuccessorColumn extends DependencyColumn {
        
        
        
    }

    export class TotalSlackColumn extends DurationColumn {
        
        
        
    }

    export class WBSColumn extends Column {
        
        
        
    }

    export class GanttTag {
        
        
        
    }

    export class AssignmentStore extends SchedulerAssignmentStore implements PartOfProject {
        
        // properties
        assignmentStore: AssignmentStore;
        calendarManagerStore: CalendarManagerStore;
        dependencyStore: DependencyStore;
        // @ts-ignore
        eventStore: TaskStore;
        resourceStore: ResourceStore;
        taskStore: TaskStore;
        // functions
        mapAssignmentsForTask(task: TaskModel|object, fn: Function, filterFn: Function): Array<any>;
        getAssignmentsForTask(task: TaskModel|object): Array<any>;
        removeAssignmentsForTask(task: TaskModel|object): void;
        getResourcesForTask(task: TaskModel|object): Array<any>;
        getTasksForResource(resource: ResourceModel|object): Array<any>;
        assignTaskToResource(task: TaskModel|object, resource: ResourceModel|object): AssignmentModel;
        unassignTaskFromResource(task: TaskModel|object, resource: ResourceModel|object): AssignmentModel;
        isTaskAssignedToResource(task: TaskModel|object, resource: ResourceModel|object, fn?: Function): boolean;
        getAssignmentForTaskAndResource(task: TaskModel, resource: ResourceModel): AssignmentModel;
        getEventStore(): TaskStore;
        getResourceStore(): ResourceStore;
        getAssignmentStore(): AssignmentStore;
        getDependencyStore(): DependencyStore;
        getCalendarManagerStore(): CalendarManagerStore;
        getProject(): ProjectModel;
    }

    export class CalendarManagerStore extends AjaxStore implements PartOfProject {
        
        // properties
        assignmentStore: AssignmentStore;
        calendarManagerStore: CalendarManagerStore;
        dependencyStore: DependencyStore;
        // @ts-ignore
        eventStore: TaskStore;
        resourceStore: ResourceStore;
        taskStore: TaskStore;
        // functions
        getEventStore(): TaskStore;
        getResourceStore(): ResourceStore;
        getAssignmentStore(): AssignmentStore;
        getDependencyStore(): DependencyStore;
        getCalendarManagerStore(): CalendarManagerStore;
        getProject(): ProjectModel;
    }

    export class DependencyStore extends SchedulerDependencyStore implements DependencyValidation, PartOfProject {
        
        // properties
        assignmentStore: AssignmentStore;
        calendarManagerStore: CalendarManagerStore;
        dependencyStore: DependencyStore;
        // @ts-ignore
        eventStore: TaskStore;
        resourceStore: ResourceStore;
        taskStore: TaskStore;
        // functions
        getTaskDependencies(task: TaskModel, flat: boolean): Array<any>;
        getTaskPredecessors(task: TaskModel, flat: boolean): Array<any>;
        getTaskSuccessors(task: TaskModel, flat: boolean): Array<any>;
        removeTaskDependencies(task: TaskModel, flat: boolean): void;
        removeTaskPredecessors(task: TaskModel, flat: boolean): void;
        removeTaskSuccessors(task: TaskModel, flat: boolean): void;
        getDependencyForSourceAndTargetTasks(sourceTask: TaskModel|string, targetTask: TaskModel|string): DependencyModel;
        getTasksLinkingDependency(sourceEvent: TaskModel, targetEvent: TaskModel): DependencyModel;
        getSourceTask(dependency: DependencyModel|object): TaskModel;
        getTargetTask(dependency: DependencyModel|object): TaskModel;
        isValidDependency(dependencyOrFromId: DependencyModel|number|string, toId?: number|string, type?: number, dependenciesToAdd?: Array<any>|Array<any>, dependenciesToRemove?: Array<any>): boolean;
        getDependencyError(dependencyOrFromId: DependencyModel|number|string, toId?: number|string, type?: number, dependenciesToAdd?: Array<any>|Array<any>, dependenciesToRemove?: Array<any>, calledFromThisDepModel?: boolean): void;
        areTasksLinkedForward(fromTask: TaskModel|object, toTask: TaskModel|object): boolean;
        areTasksLinked(task1: TaskModel|number|string, task2: TaskModel|number|string): boolean;
        hasTransitiveDependency(sourceId: string, targetId: string, ignoreDepRecords?: Array<any>, addDepRecords?: Array<any>|Array<any>): boolean;
        getEventStore(): TaskStore;
        getResourceStore(): ResourceStore;
        getAssignmentStore(): AssignmentStore;
        getDependencyStore(): DependencyStore;
        getCalendarManagerStore(): CalendarManagerStore;
        getProject(): ProjectModel;
    }

    export class ResourceStore extends SchedulerResourceStore implements PartOfProject {
        
        // properties
        assignmentStore: AssignmentStore;
        calendarManagerStore: CalendarManagerStore;
        dependencyStore: DependencyStore;
        // @ts-ignore
        eventStore: TaskStore;
        resourceStore: ResourceStore;
        taskStore: TaskStore;
        // functions
        getEventStore(): TaskStore;
        getResourceStore(): ResourceStore;
        getAssignmentStore(): AssignmentStore;
        getDependencyStore(): DependencyStore;
        getCalendarManagerStore(): CalendarManagerStore;
        getProject(): ProjectModel;
    }

    export class TaskStore extends AjaxStore implements EventStoreMixin, PartOfProject {
        
        // properties
        assignmentStore: AssignmentStore;
        calendarManagerStore: CalendarManagerStore;
        dependencyStore: DependencyStore;
        // @ts-ignore
        eventStore: TaskStore;
        resourceStore: ResourceStore;
        taskStore: TaskStore;
        // functions
        setBaseline(index: number): void;
        getEventsInTimeSpan(start: Date, end: Date, allowPartial?: boolean, onlyAssigned?: boolean): Array<any>;
        getEventsByStartDate(start: any): Array<any>;
        forEachScheduledEvent(fn: Function, thisObj: object): void;
        getTotalTimeSpan(): object;
        isEventPersistable(event: EventModel): boolean;
        isDateRangeAvailable(start: Date, end: Date, excludeEvent: EventModel, resource: ResourceModel): boolean;
        getResourcesForEvent(event: EventModel|string|number): Array<any>;
        getEventsForResource(resource: ResourceModel|string|number): Array<any>;
        getAssignmentsForEvent(event: EventModel|string|number): Array<any>;
        getAssignmentsForResource(resource: ResourceModel|string|number): Array<any>;
        assignEventToResource(event: EventModel|string|number, resource: ResourceModel|string|number|Array<any>|Array<any>|Array<any>): void;
        unassignEventFromResource(event: EventModel|string|number, resource: ResourceModel|string|number): void;
        reassignEventFromResourceToResource(event: EventModel, oldResource: ResourceModel|Array<any>, newResource: ResourceModel|Array<any>): void;
        isEventAssignedToResource(event: EventModel|string|number, resource: ResourceModel|string|number): boolean;
        removeAssignmentsForEvent(event: EventModel|string|number): void;
        removeAssignmentsForResource(resource: ResourceModel|string|number): void;
        getEventStore(): TaskStore;
        getResourceStore(): ResourceStore;
        getAssignmentStore(): AssignmentStore;
        getDependencyStore(): DependencyStore;
        getCalendarManagerStore(): CalendarManagerStore;
        getProject(): ProjectModel;
    }

    export class DependencyValidation {
        
        
        // functions
        isValidDependency(dependencyOrFromId: DependencyModel|number|string, toId?: number|string, type?: number, dependenciesToAdd?: Array<any>|Array<any>, dependenciesToRemove?: Array<any>): boolean;
        getDependencyError(dependencyOrFromId: DependencyModel|number|string, toId?: number|string, type?: number, dependenciesToAdd?: Array<any>|Array<any>, dependenciesToRemove?: Array<any>, calledFromThisDepModel?: boolean): void;
        areTasksLinkedForward(fromTask: TaskModel|object, toTask: TaskModel|object): boolean;
        areTasksLinked(task1: TaskModel|number|string, task2: TaskModel|number|string): boolean;
        hasTransitiveDependency(sourceId: string, targetId: string, ignoreDepRecords?: Array<any>, addDepRecords?: Array<any>|Array<any>): boolean;
    }

    export class GanttCrudManager implements Events, AbstractCrudManagerMixin, AjaxTransport, JsonEncoder {
        
        // properties
        crudRevision: number;
        crudStores: Array<any>;
        isCrudManagerLoading: boolean;
        syncApplySequence: Array<any>;
        // functions
        addListener(config: object, thisObj?: object, prio?: number): Function;
        on(config: any, thisObj?: any): void;
        un(config: any, thisObj: any): void;
        removeListener(config: object, thisObj: object): void;
        hasListener(eventName: string): boolean;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        trigger(eventName: string, param: object): boolean;
        suspendEvents(queue?: boolean): void;
        resumeEvents(): void;
        sendRequest(request: object): Promise<any>;
        cancelRequest(requestPromise: Promise<any>): void;
        encode(request: object): string;
        decode(responseText: string): object;
        getStoreDescriptor(storeId: string|Store): object;
        getCrudStore(storeId: string): Store;
        addCrudStore(store: Store|string|object|Array<any>|Array<any>|Array<any>, position?: number, fromStore?: string|Store|object): void;
        removeCrudStore(store: object|string|Store): void;
        addStoreToApplySequence(store: Store|object|Array<any>|Array<any>, position?: number, fromStore?: string|Store|object): void;
        removeStoreFromApplySequence(store: object|string|Store): void;
        crudStoreHasChanges(storeId?: string|Store): boolean;
        load(options: object): Promise<any>;
        sync(): Promise<any>;
        commitCrudStores(): void;
        rejectCrudStores(): void;
        doDestroy(): void;
    }

    export class PartOfProject {
        
        // properties
        assignmentStore: AssignmentStore;
        calendarManagerStore: CalendarManagerStore;
        dependencyStore: DependencyStore;
        // @ts-ignore
        eventStore: TaskStore;
        resourceStore: ResourceStore;
        taskStore: TaskStore;
        // functions
        getEventStore(): TaskStore;
        getResourceStore(): ResourceStore;
        getAssignmentStore(): AssignmentStore;
        getDependencyStore(): DependencyStore;
        getCalendarManagerStore(): CalendarManagerStore;
        getProject(): ProjectModel;
    }

    export class Baselines extends TooltipBase {
        
        // properties
        disabled: boolean;
        
    }

    export class CellEdit extends GridCellEdit {
        
        
        // functions
        doAddNewAtEnd(): Promise<any>;
    }

    export class CriticalPaths extends InstancePlugin {
        
        
        
    }

    export class Dependencies extends SchedulerDependencies {
        
        
        // functions
        drawForTask(): void;
    }

    export class DependencyEdit extends SchedulerDependencyEdit {
        
        
        
    }

    export class PercentBar extends InstancePlugin {
        
        
        
    }

    export class ProgressLine extends InstancePlugin {
        
        // properties
        disabled: boolean;
        statusDate: Date;
        // functions
        shouldDrawProgressLine(): boolean;
        draw(): void;
        hasTimeout(name: any): void;
        setTimeout(fn: Function|string, delay: number, name: string, runOnDestroy?: boolean): number;
        clearTimeout(idOrName: number|string): void;
        clearInterval(id: number): void;
        setInterval(fn: any, delay: any): number;
        requestAnimationFrame(fn: Function, args?: Array<any>, thisObj?: object): number;
        createOnFrame(fn: Function|string, args?: Array<any>, thisObj?: object, cancelOutstanding?: boolean): void;
        cancelAnimationFrame(handle: number): void;
        buffer(fn: Function|string, delay: number, thisObj?: object): Function;
        throttle(fn: Function, buffer: number): void;
    }

    export class ProjectLines extends TimeRanges {
        
        
        
    }

    export class TaskContextMenu extends TimeSpanRecordContextMenuBase {
        
        
        // functions
        showContextMenuFor(taskRecord: TaskModel, options?: object): void;
    }

    export class TaskDrag extends DragBase {
        
        
        
    }

    export class TaskDragCreate extends DragCreateBase {
        
        
        
    }

    export class TaskEdit extends InstancePlugin implements TaskEditStm {
        
        
        // functions
        editTask(taskRecord: TaskModel): void;
        hasTimeout(name: any): void;
        setTimeout(fn: Function|string, delay: number, name: string, runOnDestroy?: boolean): number;
        clearTimeout(idOrName: number|string): void;
        clearInterval(id: number): void;
        setInterval(fn: any, delay: any): number;
        requestAnimationFrame(fn: Function, args?: Array<any>, thisObj?: object): number;
        createOnFrame(fn: Function|string, args?: Array<any>, thisObj?: object, cancelOutstanding?: boolean): void;
        cancelAnimationFrame(handle: number): void;
        buffer(fn: Function|string, delay: number, thisObj?: object): Function;
        throttle(fn: Function, buffer: number): void;
    }

    export class TaskResize extends ResizeBase {
        
        
        
    }

    export class TaskTooltip extends TooltipBase {
        
        
        
    }

    export class TaskEditStm {
        
        
        
    }

    export class AssignmentModel extends SchedulerAssignmentModel implements PartOfProject {
        // fields
        // @ts-ignore
        event: TaskModel;
        eventId: string|number;
        resource: ResourceModel;
        resourceId: string|number;
        units: number;
        // properties
        assignmentStore: AssignmentStore;
        calendarManagerStore: CalendarManagerStore;
        dependencyStore: DependencyStore;
        // @ts-ignore
        eventStore: TaskStore;
        resourceStore: ResourceStore;
        task: TaskModel;
        taskName: string;
        taskStore: TaskStore;
        // functions
        setUnits(units: number): Promise<any>;
        setEvent(event: TaskModel): Promise<any>;
        setResource(event: ResourceModel): Promise<any>;
        getEventStore(): TaskStore;
        getResourceStore(): ResourceStore;
        getAssignmentStore(): AssignmentStore;
        getDependencyStore(): DependencyStore;
        getCalendarManagerStore(): CalendarManagerStore;
        getProject(): ProjectModel;
    }

    export class Baseline extends TimeSpan {
        // fields
        task: TaskModel;
        
        // functions
        convertToMilestone(): void;
        convertToRegular(): void;
    }

    export class CalendarIntervalModel {
        // fields
        endDate: Date;
        isWorking: boolean;
        recurrentEndDate: string;
        recurrentStartDate: string;
        startDate: Date;
        
        // functions
        isRecurrent(): boolean;
        isStatic(): boolean;
        getStartDateSchedule(): object;
        getEndDateSchedule(): object;
    }

    export class CalendarModel extends Model implements PartOfProject {
        // fields
        daysPerMonth: number;
        daysPerWeek: number;
        hoursPerDay: number;
        name: string;
        unspecifiedTimeIsWorking: boolean;
        // properties
        assignmentStore: AssignmentStore;
        calendarManagerStore: CalendarManagerStore;
        dependencyStore: DependencyStore;
        // @ts-ignore
        eventStore: TaskStore;
        resourceStore: ResourceStore;
        taskStore: TaskStore;
        // functions
        addInterval(interval: CalendarIntervalModel): void;
        addIntervals(intervals: Array<any>): void;
        getEventStore(): TaskStore;
        getResourceStore(): ResourceStore;
        getAssignmentStore(): AssignmentStore;
        getDependencyStore(): DependencyStore;
        getCalendarManagerStore(): CalendarManagerStore;
        getProject(): ProjectModel;
    }

    export class DependencyModel extends DependencyBaseModel {
        // fields
        fromEvent: TaskModel;
        lag: number;
        lagUnit: string;
        toEvent: TaskModel;
        // properties
        sourceTask: TaskModel;
        targetTask: TaskModel;
        // functions
        setLag(amount: number, unit?: string): Promise<any>;
        setFromEvent(event: TaskModel): Promise<any>;
        setToEvent(event: TaskModel): Promise<any>;
    }

    export class ProjectModel extends TaskModel implements GanttCrudManager {
        // fields
        endDate: string|Date;
        startDate: string|Date;
        // properties
        assignmentStore: AssignmentStore;
        calendarManagerStore: CalendarManagerStore;
        crudRevision: number;
        crudStores: Array<any>;
        dependencyStore: DependencyStore;
        eventStore: TaskStore;
        isCrudManagerLoading: boolean;
        resourceStore: ResourceStore;
        stm: StateTrackingManager;
        syncApplySequence: Array<any>;
        taskStore: TaskStore;
        // functions
        getCalendar(): CalendarModel;
        setCalendar(calendar: CalendarModel): Promise<any>;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        on(config: any, thisObj?: any): void;
        un(config: any, thisObj: any): void;
        removeListener(config: object, thisObj: object): void;
        hasListener(eventName: string): boolean;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        trigger(eventName: string, param: object): boolean;
        suspendEvents(queue?: boolean): void;
        resumeEvents(): void;
        sendRequest(request: object): Promise<any>;
        cancelRequest(requestPromise: Promise<any>): void;
        encode(request: object): string;
        decode(responseText: string): object;
        getStoreDescriptor(storeId: string|Store): object;
        getCrudStore(storeId: string): Store;
        addCrudStore(store: Store|string|object|Array<any>|Array<any>|Array<any>, position?: number, fromStore?: string|Store|object): void;
        removeCrudStore(store: object|string|Store): void;
        addStoreToApplySequence(store: Store|object|Array<any>|Array<any>, position?: number, fromStore?: string|Store|object): void;
        removeStoreFromApplySequence(store: object|string|Store): void;
        crudStoreHasChanges(storeId?: string|Store): boolean;
        load(options: object): Promise<any>;
        sync(): Promise<any>;
        commitCrudStores(): void;
        rejectCrudStores(): void;
        doDestroy(): void;
    }

    export class ResourceModel extends SchedulerResourceModel implements PartOfProject {
        // fields
        calendar: CalendarModel;
        // properties
        assignmentStore: AssignmentStore;
        assignments: Array<any>;
        calendarManagerStore: CalendarManagerStore;
        dependencyStore: DependencyStore;
        // @ts-ignore
        eventStore: TaskStore;
        resourceStore: ResourceStore;
        taskStore: TaskStore;
        tasks: Array<any>;
        // functions
        setCalendar(calendar: CalendarModel): Promise<any>;
        getCalendar(): CalendarModel;
        getEventStore(): TaskStore;
        getResourceStore(): ResourceStore;
        getAssignmentStore(): AssignmentStore;
        getDependencyStore(): DependencyStore;
        getCalendarManagerStore(): CalendarManagerStore;
        getProject(): ProjectModel;
    }

    export class TaskModel extends TimeSpan implements PartOfProject {
        // fields
        baselines: Array<any>;
        calendar: CalendarModel;
        cls: DomClassList|string;
        constraintDate: Date;
        constraintType: string;
        critical: boolean;
        draggable: boolean;
        durationUnit: string;
        earlyEndDate: Date;
        earlyStartDate: Date;
        effort: number;
        effortDriven: boolean;
        effortUnit: string;
        endDate: string|Date;
        iconCls: string;
        id: string|number;
        lateEndDate: Date;
        lateStartDate: Date;
        manuallyScheduled: boolean;
        name: string;
        note: string;
        percentDone: number;
        resizable: boolean|string;
        schedulingMode: string;
        showInTimeline: boolean;
        slackUnit: string;
        startDate: string|Date;
        totalSlack: number;
        // properties
        allDependencies: Array<any>;
        assignmentStore: AssignmentStore;
        assignments: Array<any>;
        calendarManagerStore: CalendarManagerStore;
        dependencyStore: DependencyStore;
        // @ts-ignore
        eventStore: TaskStore;
        fullEffort: object;
        incomingDeps: Set<any>;
        isInProgress: boolean;
        outgoingDeps: Set<any>;
        predecessorTasks: Array<any>;
        previousSiblingsTotalCount: number;
        resourceStore: ResourceStore;
        sequenceNumber: number;
        successorTasks: Array<any>;
        taskStore: TaskStore;
        // functions
        setBaseline(index: number): void;
        convertToMilestone(): void;
        convertToRegular(): void;
        getAssignmentFor(resource: ResourceModel): AssignmentModel|null;
        assign(resource: ResourceModel, units?: number): Promise<any>;
        unassign(resource: ResourceModel): Promise<any>;
        setCalendar(calendar: CalendarModel): Promise<any>;
        getCalendar(): CalendarModel;
        setStartDate(date: Date, keepDuration?: boolean): Promise<any>;
        setEndDate(date: Date, keepDuration?: boolean): Promise<any>;
        setDuration(duration: number, unit?: string): Promise<any>;
        setEffort(effort: number, unit?: string): Promise<any>;
        setConstraint(constraintType: string, constraintDate?: Date): Promise<any>;
        getEventStore(): TaskStore;
        getResourceStore(): ResourceStore;
        getAssignmentStore(): AssignmentStore;
        getDependencyStore(): DependencyStore;
        getCalendarManagerStore(): CalendarManagerStore;
        getProject(): ProjectModel;
    }

    export class ProjectGenerator {
        
        
        
    }

    export class Gantt extends TimelineBase implements GanttDom, GanttRegions, GanttScroll, GanttState, GanttStores, EventNavigation, TaskNavigation {
        
        // properties
        project: ProjectModel;
        // functions
        resolveTaskRecord(element: HTMLElement): TaskModel;
        getTaskRecordFromDomId(id: string): TaskModel;
        getElementFromTaskRecord(taskRecord: TaskModel): HTMLElement;
        getScheduleRegion(taskRecord: TaskModel): object;
        getTaskBox(taskRecord: TaskModel, includeOutside?: boolean, inner?: boolean): any;
        scrollTaskIntoView(taskRecord: TaskModel, options?: object): Promise<any>;
    }

    export class GanttDom {
        
        
        // functions
        resolveTaskRecord(element: HTMLElement): TaskModel;
        getTaskRecordFromDomId(id: string): TaskModel;
        getElementFromTaskRecord(taskRecord: TaskModel): HTMLElement;
    }

    export class GanttRegions {
        
        
        // functions
        getScheduleRegion(taskRecord: TaskModel): object;
        getTaskBox(taskRecord: TaskModel, includeOutside?: boolean, inner?: boolean): any;
    }

    export class GanttScroll {
        
        
        // functions
        scrollTaskIntoView(taskRecord: TaskModel, options?: object): Promise<any>;
    }

    export class GanttState {
        
        
        
    }

    export class GanttStores {
        
        
        
    }

    export class TaskNavigation {
        
        
        
    }

    export class AssignmentField extends PickerField {
        
        
        
    }

    export class AssignmentGrid extends Grid {
        
        
        
    }

    export class CalendarField {
        
        
        
    }

    export class CalendarPicker extends Combo {
        
        
        // functions
        refreshCalendars(calendars: Array<any>): void;
    }

    export class ConstraintTypePicker extends Combo {
        
        
        
    }

    export class DependencyField extends Combo {
        
        
        
    }

    export class DependencyTypePicker extends Combo {
        
        
        
    }

    export class EffortField extends DurationField {
        
        
        
    }

    export class ModelCombo {
        
        
        
    }

    export class SchedulingModePicker extends Combo {
        
        
        
    }

    export class TaskEditor extends Popup {
        
        // properties
        durationDecimalPrecision: any;
        // functions
        loadEvent(task: TaskModel): void;
    }

    export class Timeline extends Scheduler {
        
        
        
    }

    export class EventLoader {
        
        
        
    }

    export class TaskEditorTab {
        
        
        
    }

    export class CheckColumn extends WidgetColumn {
        
        
        
    }

    export class Column extends Model implements Events, Localizable {
        
        // properties
        contentElement: HTMLElement;
        defaults: object;
        element: HTMLElement;
        flex: string;
        hidden: boolean;
        icon: string;
        localeManager: LocaleManager;
        text: string;
        textElement: HTMLElement;
        textWrapper: HTMLElement;
        width: number|string;
        // functions
        getRawValue(record: Model): any;
        hide(): void;
        show(): void;
        toggle(force: boolean): void;
        resizeToFitContent(): void;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        on(config: any, thisObj?: any): void;
        un(config: any, thisObj: any): void;
        removeListener(config: object, thisObj: object): void;
        hasListener(eventName: string): boolean;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        trigger(eventName: string, param: object): boolean;
        suspendEvents(queue?: boolean): void;
        resumeEvents(): void;
        L(text: string, templateData?: object): string;
    }

    export class DateColumn extends Column {
        
        // properties
        format: string;
        
    }

    export class NumberColumn extends Column {
        
        
        
    }

    export class PercentColumn extends Column {
        
        
        
    }

    export class RatingColumn extends NumberColumn {
        
        
        
    }

    export class RowNumberColumn extends Column {
        
        
        // functions
        resizeToFitContent(): void;
    }

    export class TemplateColumn extends Column {
        
        
        
    }

    export class TimeColumn extends Column {
        
        // properties
        format: string;
        
    }

    export class TreeColumn extends Column {
        
        
        
    }

    export class WidgetColumn extends Column {
        
        
        
    }

    export class GridTag {
        
        
        
    }

    export class ColumnStore extends Store {
        
        // properties
        bottomColumns: Array<any>;
        visibleColumns: Array<any>;
        // functions
        get(field: string): Column;
        indexOf(recordOrId: any): number;
        static registerColumnType(columnClass: any): void;
    }

    export class GridRowModel extends Model {
        // fields
        cls: string;
        expanded: boolean;
        href: string;
        iconCls: string;
        rowHeight: number;
        target: string;
        
        
    }

    export class GridStorePlugin extends InstancePlugin {
        
        
        // functions
        getAdjacent(recordOrId: string|Model, next?: boolean, wrap?: boolean, skipSpecialRows?: boolean): Model;
        getNext(recordOrId: any, wrap?: boolean, skipSpecialRows?: boolean): Model;
        getPrev(recordOrId: any, wrap?: boolean, skipSpecialRows?: boolean): Model;
    }

    export class GridCellEdit extends InstancePlugin {
        
        // properties
        isEditing: boolean;
        // functions
        startEditing(cellContext: object): boolean;
        cancelEditing(silent?: boolean): void;
        finishEditing(): void;
    }

    export class CellTooltip extends InstancePlugin {
        
        
        
    }

    export class ColumnDragToolbar extends InstancePlugin {
        
        
        
    }

    export class ColumnPicker extends InstancePlugin {
        
        
        
    }

    export class ColumnReorder extends InstancePlugin {
        
        
        
    }

    export class ColumnResize extends InstancePlugin {
        
        
        
    }

    export class ContextMenu extends InstancePlugin {
        
        
        
    }

    export class Filter extends InstancePlugin {
        
        
        // functions
        showFilterEditor(column: Column, value: any): void;
        closeFilterEditor(): void;
    }

    export class FilterBar extends InstancePlugin {
        
        
        // functions
        hideFilterBar(): void;
        showFilterBar(): void;
        toggleFilterBar(): void;
    }

    export class GridFeatureManager {
        
        
        // functions
        static registerFeature(featureClass: InstancePlugin, onByDefault?: boolean, forType?: string|Array<any>): void;
    }

    export class Group extends InstancePlugin {
        
        
        // functions
        toggleCollapse(recordOrId: any, collapse: any): void;
        collapseAll(): void;
        expandAll(): void;
    }

    export class GridGroupSummary extends InstancePlugin {
        
        
        
    }

    export class QuickFind extends InstancePlugin {
        
        // properties
        found: Array<any>;
        foundCount: number;
        // functions
        search(find: any, columnFieldOrId: any): void;
        clear(): void;
        gotoHit(index: any): void;
        gotoFirstHit(): void;
        gotoLastHit(): void;
        gotoNextHit(): void;
        gotoPrevHit(): void;
    }

    export class RegionResize extends InstancePlugin {
        
        
        
    }

    export class RowReorder extends InstancePlugin {
        
        
        
    }

    export class Search extends InstancePlugin {
        
        // properties
        foundCount: number;
        isHitFocused: boolean;
        // functions
        search(find: string, gotoHit?: boolean, reapply?: boolean): void;
        clear(): void;
        gotoNextHit(): void;
        gotoPrevHit(): void;
        gotoHit(index: any): void;
        gotoFirstHit(): void;
        gotoLastHit(): void;
    }

    export class Sort extends InstancePlugin {
        
        
        
    }

    export class Stripe extends InstancePlugin {
        
        
        
    }

    export class GridSummary extends InstancePlugin {
        
        
        
    }

    export class Tree extends InstancePlugin {
        
        
        // functions
        toggleCollapse(idOrRecord: string|number|Model, collapse?: boolean, skipRefresh?: boolean): Promise<any>;
        collapse(idOrRecord: string|number|Model): Promise<any>;
        expand(idOrRecord: string|number|Model): Promise<any>;
        expandOrCollapseAll(collapse?: boolean): Promise<any>;
        collapseAll(): Promise<any>;
        expandAll(): Promise<any>;
        expandTo(idOrRecord: string|number|Model): Promise<any>;
    }

    export class Row extends Base {
        
        // properties
        bottom: number;
        cells: Array<any>;
        dataIndex: number;
        elements: Array<any>;
        height: number;
        id: string|number;
        index: number;
        isFirst: boolean;
        offsetHeight: number;
        top: number;
        // functions
        constructor(rowManager: any, index: any);
        getElement(region: string): HTMLElement;
        eachElement(fn: Function): void;
        eachCell(fn: Function): void;
        getCells(region: string): Array<any>;
        getCell(columnId: string|number): HTMLElement;
        addCls(classes: string): void;
        removeCls(classes: string): void;
    }

    export class Grid extends Widget implements Events, Pluggable, State, GridElementEvents, GridFeatures, GridResponsive, GridSelection, GridState, GridSubGrids {
        
        // properties
        bodyHeight: number;
        columnLines: boolean;
        columns: ColumnStore;
        data: Array<any>;
        features: any;
        headerHeight: number;
        plugins: object;
        readOnly: boolean;
        responsiveLevel: string;
        selectedCell: object;
        selectedCellCSSSelector: string;
        selectedRecord: Model;
        selectedRecords: Array<any>|Array<any>;
        state: object;
        store: Store|object;
        // functions
        collapseAll(): void;
        expandAll(): void;
        startEditing(cellContext: object): boolean;
        toggleCollapse(idOrRecord: string|number|Model, collapse?: boolean, skipRefresh?: boolean): Promise<any>;
        collapse(idOrRecord: string|number|Model): Promise<any>;
        expand(idOrRecord: string|number|Model): Promise<any>;
        expandTo(idOrRecord: string|number|Model): Promise<any>;
        getCell(cellContext: object): HTMLElement;
        getHeaderElement(columnId: string|number|Column): HTMLElement;
        getRecordFromElement(element: HTMLElement): Model;
        getColumnFromElement(element: HTMLElement): Column;
        scrollRowIntoView(recordOrId: Model|string|number, options?: object): Promise<any>;
        scrollColumnIntoView(column: Column|string): void;
        scrollCellIntoView(cellContext: object): void;
        scrollToBottom(): void;
        scrollToTop(): void;
        storeScroll(): object;
        restoreScroll(state: any): void;
        refreshRows(): void;
        refreshColumn(column: Column): void;
        renderRows(): void;
        renderContents(): void;
        maskBody(loadMask: string): Mask;
        unmaskBody(): void;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        on(config: any, thisObj?: any): void;
        un(config: any, thisObj: any): void;
        removeListener(config: object, thisObj: object): void;
        hasListener(eventName: string): boolean;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        trigger(eventName: string, param: object): boolean;
        suspendEvents(queue?: boolean): void;
        resumeEvents(): void;
        addPlugins(plugins: any): void;
        hasPlugin(pluginClassOrName: any): boolean;
        getPlugin(pluginClassOrName: any): object;
        hasFeature(name: string): boolean;
        spliceSelectedRecords(index: number, toRemove: Array<any>|number, toAdd: Array<any>|object): void;
        isSelected(cellSelectorOrId: object|string|number|Model): boolean;
        isSelectable(recordCellOrId: any): boolean;
        selectRow(recordOrId: any, scrollIntoView?: boolean, addToSelection?: boolean): void;
        selectCell(cellSelector: object, scrollIntoView?: boolean, addToSelection?: boolean, silent?: boolean): object;
        deselectAll(): void;
        deselectRow(recordOrId: Model|string|number): void;
        deselectCell(cellSelector: object): object;
        selectRange(fromId: string|number, toId: string|number): void;
        getSubGrid(region: string): SubGrid;
        getSubGridFromColumn(column: string|Column): SubGrid;
    }

    export class SubGrid extends Widget {
        
        // properties
        collapsed: boolean;
        flex: number|string;
        rowElements: Array<any>;
        viewRectangle: Rectangle;
        width: number;
        // functions
        scrollColumnIntoView(column: Column|string): void;
        collapse(): Promise<any>;
        expand(): Promise<any>;
    }

    export class TreeGrid extends Grid {
        
        // properties
        store: Store|object;
        // functions
        toggleCollapse(idOrRecord: string|number|Model, collapse?: boolean, skipRefresh?: boolean): Promise<any>;
        collapse(idOrRecord: string|number|Model): Promise<any>;
        expand(idOrRecord: string|number|Model): Promise<any>;
        expandTo(idOrRecord: string|number|Model): Promise<any>;
    }

    export class GridElementEvents {
        
        
        
    }

    export class GridFeatures {
        
        // properties
        features: any;
        // functions
        hasFeature(name: string): boolean;
    }

    export class GridNavigation {
        
        // properties
        cellCSSSelector: string;
        focusedCell: object;
        isActionableLocation: boolean;
        // functions
        isFocused(cellSelector: object|string|number): boolean;
        focusCell(cellSelector: object, options: object): object;
        navigateRight(event?: Event): object;
        navigateLeft(event?: Event): object;
        navigateDown(event?: Event): object;
        navigateUp(event?: Event): object;
    }

    export class GridResponsive {
        
        // properties
        responsiveLevel: string;
        
    }

    export class GridSelection {
        
        // properties
        selectedCell: object;
        selectedCellCSSSelector: string;
        selectedRecord: Model;
        selectedRecords: Array<any>|Array<any>;
        // functions
        spliceSelectedRecords(index: number, toRemove: Array<any>|number, toAdd: Array<any>|object): void;
        isSelected(cellSelectorOrId: object|string|number|Model): boolean;
        isSelectable(recordCellOrId: any): boolean;
        selectRow(recordOrId: any, scrollIntoView?: boolean, addToSelection?: boolean): void;
        selectCell(cellSelector: object, scrollIntoView?: boolean, addToSelection?: boolean, silent?: boolean): object;
        deselectAll(): void;
        deselectRow(recordOrId: Model|string|number): void;
        deselectCell(cellSelector: object): object;
        selectRange(fromId: string|number, toId: string|number): void;
    }

    export class GridState {
        
        
        
    }

    export class GridSubGrids {
        
        
        // functions
        getSubGrid(region: string): SubGrid;
        getSubGridFromColumn(column: string|Column): SubGrid;
    }

    export class ResourceInfoColumn extends Column {
        
        
        
    }

    export class TimeAxisColumn extends Column {
        
        
        // functions
        refreshHeader(): void;
    }

    export abstract class AbstractCrudManager extends Base implements Events, AbstractCrudManagerMixin {
        
        // properties
        crudRevision: number;
        crudStores: Array<any>;
        isCrudManagerLoading: boolean;
        isLoading: boolean;
        revision: number;
        stores: Array<any>;
        syncApplySequence: Array<any>;
        // functions
        commit(): void;
        reject(): void;
        addStore(store: Store|string|object|Array<any>|Array<any>|Array<any>, position?: number, fromStore?: string|Store|object): void;
        addListener(config: object, thisObj?: object, prio?: number): Function;
        on(config: any, thisObj?: any): void;
        un(config: any, thisObj: any): void;
        removeListener(config: object, thisObj: object): void;
        hasListener(eventName: string): boolean;
        relayAll(through: Events, prefix: string, transformCase?: boolean): void;
        removeAllListeners(): void;
        trigger(eventName: string, param: object): boolean;
        suspendEvents(queue?: boolean): void;
        resumeEvents(): void;
        abstract sendRequest(request: object): Promise<any>;
        abstract cancelRequest(request: object): void;
        abstract encode(request: object): string;
        abstract decode(response: string): object;
        getStoreDescriptor(storeId: string|Store): object;
        getCrudStore(storeId: string): Store;
        addCrudStore(store: Store|string|object|Array<any>|Array<any>|Array<any>, position?: number, fromStore?: string|Store|object): void;
        removeCrudStore(store: object|string|Store): void;
        addStoreToApplySequence(store: Store|object|Array<any>|Array<any>, position?: number, fromStore?: string|Store|object): void;
        removeStoreFromApplySequence(store: object|string|Store): void;
        crudStoreHasChanges(storeId?: string|Store): boolean;
        load(options: object): Promise<any>;
        sync(): Promise<any>;
        commitCrudStores(): void;
        rejectCrudStores(): void;
        doDestroy(): void;
    }

    export abstract class AbstractCrudManagerMixin {
        
        // properties
        crudRevision: number;
        crudStores: Array<any>;
        isCrudManagerLoading: boolean;
        syncApplySequence: Array<any>;
        // functions
        abstract sendRequest(request: object): Promise<any>;
        abstract cancelRequest(request: object): void;
        abstract encode(request: object): string;
        abstract decode(response: string): object;
        getStoreDescriptor(storeId: string|Store): object;
        getCrudStore(storeId: string): Store;
        addCrudStore(store: Store|string|object|Array<any>|Array<any>|Array<any>, position?: number, fromStore?: string|Store|object): void;
        removeCrudStore(store: object|string|Store): void;
        addStoreToApplySequence(store: Store|object|Array<any>|Array<any>, position?: number, fromStore?: string|Store|object): void;
        removeStoreFromApplySequence(store: object|string|Store): void;
        crudStoreHasChanges(storeId?: string|Store): boolean;
        load(options: object): Promise<any>;
        sync(): Promise<any>;
        commitCrudStores(): void;
        rejectCrudStores(): void;
        doDestroy(): void;
    }

    export class JsonEncoder {
        
        
        // functions
        encode(request: object): string;
        decode(responseText: string): object;
    }

    export abstract class AjaxTransport {
        
        
        // functions
        cancelRequest(requestPromise: Promise<any>): void;
        sendRequest(request: object): Promise<any>;
    }

    export class SchedulerTag {
        
        
        
    }

    export class SchedulerAssignmentStore extends Store {
        
        // properties
        eventStore: any;
        // functions
        mapAssignmentsForEvent(event: EventModel, fn?: Function, filterFn?: Function): Array<any>;
        mapAssignmentsForResource(resource: ResourceModel|number|string, fn?: Function, filterFn?: Function): Array<any>;
        getAssignmentsForEvent(event: TimeSpan): Array<any>;
        removeAssignmentsForEvent(event: TimeSpan|object): void;
        getAssignmentsForResource(event: ResourceModel|object): Array<any>;
        removeAssignmentsForResource(resource: ResourceModel|any): void;
        getResourcesForEvent(event: EventModel): Array<any>;
        getEventsForResource(resource: ResourceModel|any): Array<any>;
        assignEventToResource(event: TimeSpan|any, resource: ResourceModel|Array<any>): Array<any>;
        unassignEventFromResource(event: TimeSpan|string|number, resource?: ResourceModel|string|number): AssignmentModel|Array<any>;
        isEventAssignedToResource(event: EventModel|string|number, resource: ResourceModel|string|number): boolean;
        getAssignmentForEventAndResource(event: EventModel|string|number, resource: ResourceModel|string|number): AssignmentModel;
    }

    export class Calendar {
        
        // properties
        static allCalendars: Array<any>;
        calendarId: string;
        parent: any;
        // functions
        static getCalendar(id: string): Calendar;
        removeAll(): Array<any>;
        intersectsWithCurrentWeeks(startDate: Date, endDate: Date): boolean;
        addNonStandardWeek(startDate: Date, endDate: Date, weekAvailability: Array<any>|Array<any>, name: string): void;
        getNonStandardWeekByStartDate(startDate: Date): object;
        removeNonStandardWeek(startDate: Date): void;
        getNonStandardWeekByDate(timeDate: Date): object;
        setWeekendsAreWorkDays(value: boolean): void;
        areWeekendsWorkDays(): boolean;
        forEachNonStandardWeek(func: Function, thisObj: object): boolean;
        getCalendarDay(timeDate: Date): CalendarDayModel;
        getOverrideDay(timeDate: Date): CalendarDayModel;
        getOwnCalendarDay(timeDate: Date): CalendarDayModel;
        getWeekDay(weekDayIndex: number, timeDate?: Date): CalendarDayModel;
        isHoliday(timeDate: Date): boolean;
        getDefaultCalendarDay(weekDayIndex: number): CalendarDayModel;
        isWorkingDay(date: Date): boolean;
        isWeekend(timeDate: Date): boolean;
        convertMSDurationToUnit(durationInMs: number, unit: string): number;
        convertDurationToMs(durationInMs: number, unit: string): number;
        forEachAvailabilityInterval(options: object, func: Function, thisObj: object): boolean;
        calculateDuration(startDate: Date, endDate: Date, unit: string): number;
        getHolidaysRanges(startDate: Date, endDate: Date): Array<any>;
        calculateEndDate(startDate: Date, duration: number, unit: string): Date;
        skipNonWorkingTime(date: Date, isForward: boolean): Date;
        calculateStartDate(endDate: Date, duration: number, unit: string): Date;
        skipWorkingTime(date: Date, duration: number, unit: string): Date;
        getAvailabilityIntervalsFor(timeDate: Date|number): Array<any>;
    }

    export class CrudManager extends AbstractCrudManager implements JsonEncoder, AjaxTransport {
        
        // properties
        assignmentStore: AssignmentStore;
        dependencyStore: DependencyStore;
        eventStore: EventStore;
        resourceStore: ResourceStore;
        timeRangesStore: Store;
        // functions
        encode(request: object): string;
        decode(responseText: string): object;
        cancelRequest(requestPromise: Promise<any>): void;
        sendRequest(request: object): Promise<any>;
    }

    export class SchedulerDependencyStore extends AjaxStore {
        
        // properties
        eventStore: EventStore;
        // functions
        getEventDependencies(event: EventModel, flat?: boolean): Array<any>;
        getEventPredecessors(event: EventModel, flat?: boolean): Array<any>;
        getEventSuccessors(event: EventModel, flat?: boolean): Array<any>;
        getDependencyForSourceAndTargetEvents(sourceEvent: EventModel|string, targetEvent: EventModel|string): DependencyModel;
        getEventsLinkingDependency(sourceEvent: EventModel|string, targetEvent: EventModel|string): DependencyModel;
        isValidDependency(dependencyOrFromId: DependencyModel|number|string, toId?: number|string, type?: number): boolean;
        getHighlightedDependencies(cls: string): Array<any>;
    }

    export class EventStore extends AjaxStore implements EventStoreMixin {
        
        // properties
        assignmentStore: AssignmentStore;
        dependencyStore: DependencyStore;
        resourceStore: ResourceStore;
        // functions
        append(record: EventModel): void;
        getEventsInTimeSpan(start: Date, end: Date, allowPartial?: boolean, onlyAssigned?: boolean): Array<any>;
        getEventsByStartDate(start: any): Array<any>;
        forEachScheduledEvent(fn: Function, thisObj: object): void;
        getTotalTimeSpan(): object;
        isEventPersistable(event: EventModel): boolean;
        isDateRangeAvailable(start: Date, end: Date, excludeEvent: EventModel, resource: ResourceModel): boolean;
        getResourcesForEvent(event: EventModel|string|number): Array<any>;
        getEventsForResource(resource: ResourceModel|string|number): Array<any>;
        getAssignmentsForEvent(event: EventModel|string|number): Array<any>;
        getAssignmentsForResource(resource: ResourceModel|string|number): Array<any>;
        assignEventToResource(event: EventModel|string|number, resource: ResourceModel|string|number|Array<any>|Array<any>|Array<any>): void;
        unassignEventFromResource(event: EventModel|string|number, resource: ResourceModel|string|number): void;
        reassignEventFromResourceToResource(event: EventModel, oldResource: ResourceModel|Array<any>, newResource: ResourceModel|Array<any>): void;
        isEventAssignedToResource(event: EventModel|string|number, resource: ResourceModel|string|number): boolean;
        removeAssignmentsForEvent(event: EventModel|string|number): void;
        removeAssignmentsForResource(resource: ResourceModel|string|number): void;
    }

    export class SchedulerResourceStore extends AjaxStore implements ResourceStoreMixin {
        
        // properties
        eventStore: EventStore;
        
    }

    export class ResourceTimeRangeStore extends AjaxStore {
        
        
        
    }

    export class TimeAxis extends Store {
        
        // properties
        endDate: Date;
        isContinuous: boolean;
        ticks: Array<any>;
        viewPreset: ViewPreset;
        // functions
        setTimeSpan(newStartDate: Date, newEndDate: Date): void;
        shift(amount: number, unit?: string): void;
        shiftNext(amount?: number): void;
        shiftPrevious(amount?: number): void;
        filterBy(fn: Function, thisObj?: object): void;
        generateTicks(axisStartDate: Date, axisEndDate: Date, unit: string, increment: number): Array<any>;
        getTickFromDate(date: Date): number;
        getDateFromTick(tick: number, roundingMethod?: string): Date;
        dateInAxis(date: Date): boolean;
        timeSpanInAxis(start: Date, end: Date): boolean;
    }

    export class EventStoreMixin {
        
        // properties
        assignmentStore: AssignmentStore;
        dependencyStore: DependencyStore;
        resourceStore: ResourceStore;
        // functions
        getEventsInTimeSpan(start: Date, end: Date, allowPartial?: boolean, onlyAssigned?: boolean): Array<any>;
        getEventsByStartDate(start: any): Array<any>;
        forEachScheduledEvent(fn: Function, thisObj: object): void;
        getTotalTimeSpan(): object;
        isEventPersistable(event: EventModel): boolean;
        isDateRangeAvailable(start: Date, end: Date, excludeEvent: EventModel, resource: ResourceModel): boolean;
        getResourcesForEvent(event: EventModel|string|number): Array<any>;
        getEventsForResource(resource: ResourceModel|string|number): Array<any>;
        getAssignmentsForEvent(event: EventModel|string|number): Array<any>;
        getAssignmentsForResource(resource: ResourceModel|string|number): Array<any>;
        assignEventToResource(event: EventModel|string|number, resource: ResourceModel|string|number|Array<any>|Array<any>|Array<any>): void;
        unassignEventFromResource(event: EventModel|string|number, resource: ResourceModel|string|number): void;
        reassignEventFromResourceToResource(event: EventModel, oldResource: ResourceModel|Array<any>, newResource: ResourceModel|Array<any>): void;
        isEventAssignedToResource(event: EventModel|string|number, resource: ResourceModel|string|number): boolean;
        removeAssignmentsForEvent(event: EventModel|string|number): void;
        removeAssignmentsForResource(resource: ResourceModel|string|number): void;
    }

    export class ResourceStoreMixin {
        
        // properties
        eventStore: EventStore;
        
    }

    export abstract class AbstractTimeRanges extends InstancePlugin {
        
        // properties
        disabled: boolean;
        showHeaderElements: boolean;
        store: Store;
        // functions
        getTipHtml(): void;
        hasTimeout(name: any): void;
        setTimeout(fn: Function|string, delay: number, name: string, runOnDestroy?: boolean): number;
        clearTimeout(idOrName: number|string): void;
        clearInterval(id: number): void;
        setInterval(fn: any, delay: any): number;
        requestAnimationFrame(fn: Function, args?: Array<any>, thisObj?: object): number;
        createOnFrame(fn: Function|string, args?: Array<any>, thisObj?: object, cancelOutstanding?: boolean): void;
        cancelAnimationFrame(handle: number): void;
        buffer(fn: Function|string, delay: number, thisObj?: object): Function;
        throttle(fn: Function, buffer: number): void;
    }

    export class ColumnLines extends InstancePlugin {
        
        
        
    }

    export class SchedulerDependencies extends InstancePlugin implements DependencyCreation {
        
        // properties
        disabled: boolean;
        // functions
        refreshDependency(dependency: DependencyModel): void;
        drawDependency(dependency: DependencyModel): void;
        drawForEvent(): void;
        draw(): void;
        releaseDependency(dependency: DependencyModel): void;
        getConnectorStartSide(timeSpanRecord: TimeSpan): string;
        getConnectorEndSide(timeSpanRecord: TimeSpan): string;
        abort(): void;
        showTerminals(timeSpanRecord: TimeSpan, element: HTMLElement): void;
        hideTerminals(eventElement: HTMLElement): void;
    }

    export class SchedulerDependencyEdit extends InstancePlugin {
        
        // properties
        cancelButton: Button;
        deleteButton: Button;
        disabled: boolean;
        fromNameField: DisplayField;
        lagField: DurationField;
        saveButton: Button;
        toNameField: DisplayField;
        typeField: Combo;
        // functions
        onBeforeSave(dependencyRecord: DependencyModel): void;
        onAfterSave(dependencyRecord: DependencyModel): void;
        editDependency(dependencyRecord: DependencyModel): void;
    }

    export class EventContextMenu extends TimeSpanRecordContextMenuBase {
        
        
        // functions
        showContextMenuFor(eventRecord: EventModel, options?: object): void;
    }

    export class EventDrag extends DragBase {
        
        
        // functions
        getRelatedRecords(eventRecord: EventModel): Array<any>;
    }

    export class EventDragCreate extends DragCreateBase {
        
        
        
    }

    export class EventDragSelect extends InstancePlugin {
        
        
        // functions
        hasTimeout(name: any): void;
        setTimeout(fn: Function|string, delay: number, name: string, runOnDestroy?: boolean): number;
        clearTimeout(idOrName: number|string): void;
        clearInterval(id: number): void;
        setInterval(fn: any, delay: any): number;
        requestAnimationFrame(fn: Function, args?: Array<any>, thisObj?: object): number;
        createOnFrame(fn: Function|string, args?: Array<any>, thisObj?: object, cancelOutstanding?: boolean): void;
        cancelAnimationFrame(handle: number): void;
        buffer(fn: Function|string, delay: number, thisObj?: object): Function;
        throttle(fn: Function, buffer: number): void;
    }

    export class EventEdit extends EditBase {
        
        // properties
        cancelButton: Button;
        deleteButton: Button;
        endDateField: DateField;
        endTimeField: TimeField;
        eventRecord: EventModel;
        nameField: TextField;
        resourceField: Combo;
        saveButton: Button;
        startDateField: DateField;
        startTimeField: TimeField;
        // functions
        editEvent(eventRecord: EventModel, resourceRecord?: ResourceModel, element?: HTMLElement): void;
    }

    export class EventFilter extends InstancePlugin {
        
        
        
    }

    export class EventResize extends ResizeBase {
        
        
        
    }

    export class EventTooltip extends TooltipBase {
        
        
        
    }

    export class GroupSummary extends GridGroupSummary {
        
        
        
    }

    export class HeaderContextMenu extends InstancePlugin {
        
        
        
    }

    export class Labels extends InstancePlugin {
        
        // properties
        disabled: boolean;
        
    }

    export class NonWorkingTime extends AbstractTimeRanges {
        
        
        
    }

    export class Pan extends InstancePlugin {
        
        
        
    }

    export class ResourceTimeRanges extends InstancePlugin {
        
        
        
    }

    export class ScheduleContextMenu extends TimeSpanRecordContextMenuBase {
        
        
        
    }

    export class ScheduleTooltip extends InstancePlugin {
        
        // properties
        disabled: boolean;
        // functions
        getHoverTipHtml(): void;
        getText(date: Date, event: Event): string;
    }

    export class SimpleEventEdit extends InstancePlugin {
        
        // properties
        eventRecord: EventModel;
        // functions
        editEvent(eventRecord: EventModel, resourceRecord?: ResourceModel): void;
    }

    export class Summary extends GridSummary {
        
        
        
    }

    export class TimeRanges extends AbstractTimeRanges {
        
        // properties
        disabled: boolean;
        showCurrentTimeLine: boolean;
        store: Store;
        
    }

    export abstract class DragBase extends InstancePlugin {
        
        // properties
        disabled: boolean;
        // functions
        getTipHtml(): void;
    }

    export class DragCreateBase extends InstancePlugin {
        
        
        // functions
        addProxy(config: any): void;
        initResizer(event: any, data: any): void;
        initTooltip(): void;
        getTipHtml(): any;
    }

    export class EditBase extends InstancePlugin {
        
        
        // functions
        onBeforeSave(eventRecord: EventModel): void;
        onAfterSave(eventRecord: EventModel): void;
    }

    export abstract class ResizeBase extends InstancePlugin {
        
        
        
    }

    export abstract class TimeSpanRecordContextMenuBase extends InstancePlugin {
        
        
        // functions
        showContextMenuFor(record: TimeSpan, options?: object): void;
    }

    export class TooltipBase extends InstancePlugin {
        
        // properties
        tooltip: Tooltip;
        
    }

    export class DependencyCreation {
        
        
        // functions
        abort(): void;
        showTerminals(timeSpanRecord: TimeSpan, element: HTMLElement): void;
        hideTerminals(eventElement: HTMLElement): void;
    }

    export class SchedulerAssignmentModel extends Model {
        // fields
        eventId: string|number;
        resourceId: string|number;
        // properties
        assignmentStore: AssignmentStore;
        event: EventModel;
        eventName: string;
        eventStore: EventStore;
        isPersistable: boolean;
        resource: ResourceModel;
        resourceName: string;
        resourceStore: ResourceStore;
        // functions
        getResource(): ResourceModel;
    }

    export class CalendarDayModel extends Model {
        // fields
        availability: Array<any>|Array<any>;
        cls: string;
        date: string|Date;
        id: string|number;
        isWorkingDay: boolean;
        name: string;
        overrideEndDate: Date;
        overrideStartDate: Date;
        type: string;
        weekday: number;
        // properties
        totalHours: number;
        totalMS: number;
        // functions
        clearDate(): void;
        getAvailability(asString: boolean): Array<any>|Array<any>;
        addAvailabilityInterval(startTime: Date|string, endTime: Date|string): void;
        removeAvailabilityInterval(index: number): void;
        getAvailabilityIntervalsFor(timeDate: Date): Array<any>;
        getAvailabilityStartFor(timeDate: Date): Date;
        getAvailabilityEndFor(timeDate: Date): Date;
    }

    export class DependencyBaseModel extends Model {
        // fields
        bidirectional: boolean;
        cls: string;
        from: string|number;
        fromSide: string;
        lag: number;
        lagUnit: string;
        to: string|number;
        toSide: string;
        type: number;
        // properties
        static Type: object;
        fullLag: object;
        isPersistable: boolean;
        sourceEvent: EventModel;
        targetEvent: EventModel;
        // functions
        setLag(lag: number|string|object, lagUnit?: string): void;
        getSourceEvent(): EventModel;
        getTargetEvent(): EventModel;
        highlight(cls: string): void;
        unhighlight(cls: string): void;
        isHighlightedWith(cls: string): boolean;
    }

    export class SchedulerDependencyModel extends DependencyBaseModel {
        
        
        
    }

    export class EventModel extends TimeSpan {
        // fields
        draggable: boolean;
        eventColor: string;
        eventStyle: string;
        iconCls: string;
        id: string|number;
        milestoneWidth: number;
        resizable: boolean|string;
        resourceId: string|number;
        // properties
        assignmentStore: AssignmentStore;
        assignments: Array<any>;
        eventStore: EventStore;
        isDraggable: boolean;
        isEvent: any;
        isPersistable: boolean;
        isResizable: any;
        resource: ResourceModel;
        resourceStore: ResourceStore;
        resources: Array<any>;
        // functions
        getResource(resourceId: string): ResourceModel;
        assign(resource: ResourceModel|string|number): void;
        unassign(resource?: ResourceModel|string|number|Array<any>): void;
        reassign(oldResourceId: ResourceModel|string|number, newResourceId: ResourceModel|string|number): void;
        isAssignedTo(resource: ResourceModel|string|number): boolean;
    }

    export class SchedulerResourceModel extends GridRowModel {
        // fields
        eventColor: string;
        eventStyle: string;
        id: string|number;
        name: string;
        // properties
        assignmentStore: AssignmentStore;
        assignments: Array<any>;
        eventStore: EventStore;
        events: Array<any>;
        isPersistable: boolean;
        resourceStore: ResourceStore;
        // functions
        getEvents(eventStore: EventStore): Array<any>;
        isAbove(otherResource: ResourceModel): boolean;
        unassignAll(): void;
    }

    export class ResourceTimeRangeModel extends TimeSpan {
        // fields
        resourceId: string|number;
        timeRangeColor: string;
        
        
    }

    export class TimeSpan extends Model {
        // fields
        cls: DomClassList|string;
        duration: number;
        durationUnit: string;
        endDate: string|Date;
        name: string;
        startDate: string|Date;
        style: string;
        // properties
        dates: Array<any>;
        fullDuration: any;
        isScheduled: boolean;
        // functions
        setDuration(duration: number, durationUnit: string): void;
        setStartDate(date: Date, keepDuration?: boolean): void;
        setEndDate(date: Date, keepDuration?: boolean): void;
        setStartEndDate(start: Date, end: Date): void;
        forEachDate(func: Function, thisObj: object): void;
        shift(unit: string, amount: number): void;
        split(splitPoint?: number): TimeSpan;
    }

    export class PresetManager {
        
        
        // functions
        static registerPreset(name: string, config: object): void;
        static getPreset(preset: string|object): object;
        static normalizePreset(presetOrName: string|object): ViewPreset;
        static deletePreset(name: string): void;
    }

    export class ViewPreset {
        
        
        
    }

    export class ViewPresetHeaderRow {
        
        
        
    }

    export class Scheduler extends TimelineBase implements EventNavigation, EventSelection, SchedulerDom, SchedulerDomEvents, SchedulerEventRendering, SchedulerRegions, SchedulerScroll, SchedulerState, SchedulerStores, TimelineDateMapper, TimelineDomEvents, TimelineEventRendering, TimelineScroll, TimelineViewPresets, TimelineZoomable {
        
        // properties
        static eventColors: string;
        static eventStyles: string;
        assignmentStore: AssignmentStore;
        assignments: Array<any>|Array<any>;
        barMargin: number;
        crudManager: CrudManager;
        dependencyStore: DependencyStore;
        displayDateFormat: string;
        eventLayout: string;
        eventStore: EventStore;
        events: Array<any>|Array<any>;
        fillTicks: string;
        maxZoomLevel: number;
        milestoneAlign: any;
        minZoomLevel: number;
        resourceStore: ResourceStore;
        resources: Array<any>|Array<any>;
        scrollLeft: number;
        scrollTop: number;
        selectedEvents: Array<any>|Array<any>;
        snap: boolean;
        tickWidth: number;
        timeResolution: object;
        viewPreset: ViewPreset|string;
        viewportCenterDate: Date;
        zoomLevel: number;
        // functions
        editEvent(eventRecord: EventModel, resourceRecord?: ResourceModel, element?: HTMLElement): void;
        getEventMenuItems(params: object): void;
        getScheduleMenuItems(params: object): void;
        isDateRangeAvailable(start: Date, end: Date, excludeEvent: EventModel, resource: ResourceModel): boolean;
        isEventSelected(event: EventModel|AssignmentModel): void;
        selectEvent(event: EventModel|AssignmentModel, preserveSelection?: boolean): void;
        deselectEvent(event: EventModel|AssignmentModel): void;
        selectEvents(events: Array<any>|Array<any>): void;
        deselectEvents(events: Array<any>|Array<any>): void;
        clearEventSelection(): void;
        getElementFromAssignmentRecord(assignmentRecord: AssignmentModel): HTMLElement;
        getElementFromEventRecord(eventRecord: EventModel, resourceRecord: ResourceModel): HTMLElement;
        getElementsFromEventRecord(eventRecord: EventModel, resourceRecord?: ResourceModel): Array<any>;
        getEventRecordFromDomId(id: string): EventModel;
        getResourceRecordFromDomId(id: string): ResourceModel;
        resolveResourceRecord(element: HTMLElement): ResourceModel;
        resolveEventRecord(element: HTMLElement): EventModel;
        resolveAssignmentRecord(element: HTMLElement): AssignmentModel;
        getMilestoneLabelWidth(eventRecord: EventModel): number;
        repaintEventsForResource(resourceRecord: ResourceModel): void;
        onEventDataGenerated(eventData: object): void;
        getScheduleRegion(resourceRecord: ResourceModel, eventRecord: EventModel): object;
        getResourceRegion(resourceRecord: ResourceModel, startDate: Date, endDate: Date): object;
        getStartEndDatesFromRectangle(rect: Rectangle, roundingMethod: string): object;
        getResourceEventBox(eventRecord: EventModel, resourceRecord: ResourceModel, includeOutside?: boolean): any;
        scrollEventIntoView(eventRec: EventModel, options?: object): Promise<any>;
        scrollResourceEventIntoView(resourceRec: ResourceModel, eventRec: EventModel, index: number, options?: object): Promise<any>;
        onAssignmentFilter(): void;
        applyStartEndParameters(): void;
        getDateFromCoordinate(coordinate: number, roundingMethod?: string, local?: boolean): Date;
        getDateFromX(x: number, roundingMethod: string, local?: boolean): Date;
        getDateFromXY(xy: Array<any>, roundingMethod?: string, local?: boolean): Date;
        getCoordinateFromDate(date: Date|number, options?: boolean|object): number;
        getDateFromDomEvent(e: Event, roundingMethod?: string, local?: boolean): Date;
        getTimeSpanDistance(startDate: Date, endDate: Date): number;
        scrollToDate(date: Date, options?: object): Promise<any>;
        scrollToNow(options?: object): Promise<any>;
        scrollHorizontallyTo(coordinate: any, animate?: any): void;
        scrollVerticallyTo(y: any, animate?: any): void;
        scrollTo(x: any, animate: any): void;
        zoomTo(config: object|string|number): void;
        zoomToFit(options?: object): void;
        zoomIn(levels?: number): number;
        zoomOut(levels?: number): number;
        zoomInFull(): number;
        zoomOutFull(): number;
        setTimeSpan(startDate: Date, endDate: Date): void;
        shift(amount: number, unit?: string): void;
        shiftNext(amount?: number): void;
        shiftPrevious(amount?: number): void;
    }

    export abstract class TimelineBase extends Grid implements TimelineDateMapper, TimelineDomEvents, TimelineEventRendering, TimelineScroll, TimelineViewPresets, TimelineZoomable {
        
        // properties
        static eventColors: string;
        static eventStyles: string;
        barMargin: number;
        displayDateFormat: string;
        endDate: Date;
        hasVisibleEvents: boolean;
        maxZoomLevel: number;
        minZoomLevel: number;
        scrollLeft: number;
        scrollTop: number;
        snap: boolean;
        tickWidth: number;
        timeAxisViewModel: TimeAxisViewModel;
        timeResolution: object;
        viewPreset: ViewPreset|string;
        viewportCenterDate: Date;
        workingTime: object;
        zoomLevel: number;
        // functions
        setStartDate(date: Date, keepDuration?: boolean): void;
        setEndDate(date: Date, keepDuration?: boolean): void;
        refreshWithTransition(): void;
        getVisibleDateRange(): object;
        getDateFromCoordinate(coordinate: number, roundingMethod?: string, local?: boolean): Date;
        getDateFromX(x: number, roundingMethod: string, local?: boolean): Date;
        getDateFromXY(xy: Array<any>, roundingMethod?: string, local?: boolean): Date;
        getCoordinateFromDate(date: Date|number, options?: boolean|object): number;
        getDateFromDomEvent(e: Event, roundingMethod?: string, local?: boolean): Date;
        getTimeSpanDistance(startDate: Date, endDate: Date): number;
        scrollToDate(date: Date, options?: object): Promise<any>;
        scrollToNow(options?: object): Promise<any>;
        scrollHorizontallyTo(coordinate: any, animate?: any): void;
        scrollVerticallyTo(y: any, animate?: any): void;
        scrollTo(x: any, animate: any): void;
        zoomTo(config: object|string|number): void;
        zoomToFit(options?: object): void;
        zoomIn(levels?: number): number;
        zoomOut(levels?: number): number;
        zoomInFull(): number;
        zoomOutFull(): number;
        setTimeSpan(startDate: Date, endDate: Date): void;
        shift(amount: number, unit?: string): void;
        shiftNext(amount?: number): void;
        shiftPrevious(amount?: number): void;
    }

    export class EventNavigation {
        
        
        
    }

    export class EventSelection {
        
        // properties
        selectedEvents: Array<any>|Array<any>;
        // functions
        isEventSelected(event: EventModel|AssignmentModel): void;
        selectEvent(event: EventModel|AssignmentModel, preserveSelection?: boolean): void;
        deselectEvent(event: EventModel|AssignmentModel): void;
        selectEvents(events: Array<any>|Array<any>): void;
        deselectEvents(events: Array<any>|Array<any>): void;
        clearEventSelection(): void;
    }

    export class SchedulerDom {
        
        
        // functions
        getElementFromAssignmentRecord(assignmentRecord: AssignmentModel): HTMLElement;
        getElementFromEventRecord(eventRecord: EventModel, resourceRecord: ResourceModel): HTMLElement;
        getElementsFromEventRecord(eventRecord: EventModel, resourceRecord?: ResourceModel): Array<any>;
        getEventRecordFromDomId(id: string): EventModel;
        getResourceRecordFromDomId(id: string): ResourceModel;
        resolveResourceRecord(element: HTMLElement): ResourceModel;
        resolveEventRecord(element: HTMLElement): EventModel;
        resolveAssignmentRecord(element: HTMLElement): AssignmentModel;
        getMilestoneLabelWidth(eventRecord: EventModel): number;
    }

    export class SchedulerDomEvents {
        
        
        
    }

    export class SchedulerEventRendering {
        
        // properties
        eventLayout: string;
        fillTicks: string;
        // functions
        repaintEventsForResource(resourceRecord: ResourceModel): void;
        onEventDataGenerated(eventData: object): void;
    }

    export class SchedulerRegions {
        
        
        // functions
        getScheduleRegion(resourceRecord: ResourceModel, eventRecord: EventModel): object;
        getResourceRegion(resourceRecord: ResourceModel, startDate: Date, endDate: Date): object;
        getStartEndDatesFromRectangle(rect: Rectangle, roundingMethod: string): object;
        getResourceEventBox(eventRecord: EventModel, resourceRecord: ResourceModel, includeOutside?: boolean): any;
    }

    export class SchedulerScroll {
        
        
        // functions
        scrollEventIntoView(eventRec: EventModel, options?: object): Promise<any>;
        scrollResourceEventIntoView(resourceRec: ResourceModel, eventRec: EventModel, index: number, options?: object): Promise<any>;
    }

    export class SchedulerState {
        
        
        
    }

    export class SchedulerStores {
        
        // properties
        assignmentStore: AssignmentStore;
        assignments: Array<any>|Array<any>;
        crudManager: CrudManager;
        dependencyStore: DependencyStore;
        eventStore: EventStore;
        events: Array<any>|Array<any>;
        resourceStore: ResourceStore;
        resources: Array<any>|Array<any>;
        // functions
        onAssignmentFilter(): void;
        applyStartEndParameters(): void;
    }

    export class TimelineDateMapper {
        
        // properties
        displayDateFormat: string;
        snap: boolean;
        timeResolution: object;
        viewportCenterDate: Date;
        // functions
        getDateFromCoordinate(coordinate: number, roundingMethod?: string, local?: boolean): Date;
        getDateFromX(x: number, roundingMethod: string, local?: boolean): Date;
        getDateFromXY(xy: Array<any>, roundingMethod?: string, local?: boolean): Date;
        getCoordinateFromDate(date: Date|number, options?: boolean|object): number;
        getDateFromDomEvent(e: Event, roundingMethod?: string, local?: boolean): Date;
        getTimeSpanDistance(startDate: Date, endDate: Date): number;
    }

    export class TimelineDomEvents {
        
        
        
    }

    export class TimelineEventRendering {
        
        // properties
        static eventColors: string;
        static eventStyles: string;
        barMargin: number;
        tickWidth: number;
        
    }

    export class TimelineScroll {
        
        // properties
        scrollLeft: number;
        scrollTop: number;
        // functions
        scrollToDate(date: Date, options?: object): Promise<any>;
        scrollToNow(options?: object): Promise<any>;
        scrollHorizontallyTo(coordinate: any, animate?: any): void;
        scrollVerticallyTo(y: any, animate?: any): void;
        scrollTo(x: any, animate: any): void;
    }

    export class TimelineViewPresets {
        
        // properties
        viewPreset: ViewPreset|string;
        
    }

    export class TimelineZoomable {
        
        // properties
        maxZoomLevel: number;
        minZoomLevel: number;
        zoomLevel: number;
        // functions
        zoomTo(config: object|string|number): void;
        zoomToFit(options?: object): void;
        zoomIn(levels?: number): number;
        zoomOut(levels?: number): number;
        zoomInFull(): number;
        zoomOutFull(): number;
        setTimeSpan(startDate: Date, endDate: Date): void;
        shift(amount: number, unit?: string): void;
        shiftNext(amount?: number): void;
        shiftPrevious(amount?: number): void;
    }

    export class TimeAxisViewModel extends Events {
        
        
        // functions
        getDistanceBetweenDates(start: Date, end: Date): number;
        getDistanceForDuration(durationMS: number): number;
        getPositionFromDate(date: Date): number;
        getDateFromPosition(position: number, roundingMethod?: string): Date;
    }

    export enum DependencyError {
        OK,
        OTHER_ERROR,
        TASK_MISSING,
        TRANSITIVE_DEPENDENCY,
        CYCLIC_DEPENDENCY,
        TRANSITIVE_ROUTE_PART,
        CYCLIC_GROUPS,
        TRANSITIVE_GROUPS,
        PARENT_CHILD_DEPENDENCY,
        WRONG_TYPE,
        PARENT_TASK_DEPENDENCY,
        PROJECT_DEPENDENCY,
        OTHER_PROJECT_DEPENDENCY
    }

    export enum EffectResolutionResult {
        Cancel,
        Restart,
        Resume
    }

}