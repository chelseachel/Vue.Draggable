<p align="center"><img width="140"src="https://raw.githubusercontent.com/SortableJS/Vue.Draggable/master/logo.svg?sanitize=true"></p>
<h1 align="center">Vue.Draggable with lock-axis</h1>

This library is a lock-axis version of [Vue.Draggable](https://sortablejs.github.io/Vue.Draggable/) for Vue 2.0. Supports fixed axis on horizontal or vertical direction.


To lock axis, just add options fallbackAxis: 'x' or 'y' and forceFallback: true.<br>
Checkout the simple list example in the demo page.
## Demo
https://chelseachel.github.io/Vue.Draggable-Lock-Axis/
## Installation

### With npm

```bash
$ npm uninstall vuedraggable --save
$ npm install vuedraggable-axis --save
```

## For Vue.js 2.0

Use draggable component:

### Typical use:
``` html
<draggable v-model="myArray" group="people" @start="drag=true" @end="drag=false">
   <div v-for="element in myArray" :key="element.id">{{element.name}}</div>
</draggable>
```
.vue file:
``` js
  import draggable from 'vuedraggable'
  ...
  export default {
        components: {
            draggable,
        },
  ...
```

### With `transition-group`:
``` html
<draggable v-model="myArray">
    <transition-group>
        <div v-for="element in myArray" :key="element.id">
            {{element.name}}
        </div>
    </transition-group>
</draggable>
```

Draggable component should directly wrap the draggable elements, or a `transition-component` containing the draggable elements.


### With footer slot:
``` html
<draggable v-model="myArray" draggable=".item">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="footer" @click="addPeople">Add</button>
</draggable>
```
### With header slot:
``` html
<draggable v-model="myArray" draggable=".item">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="header" @click="addPeople">Add</button>
</draggable>
```

### With Vuex:

```html
<draggable v-model='myList'>
``` 

```javascript
computed: {
    myList: {
        get() {
            return this.$store.state.myList
        },
        set(value) {
            this.$store.commit('updateList', value)
        }
    }
}
```


### Props
#### value
Type: `Array`<br>
Required: `false`<br>
Default: `null`

Input array to draggable component. Typically same array as referenced by inner element v-for directive.<br>
This is the preferred way to use Vue.draggable as it is compatible with Vuex.<br>
It should not be used directly but only though the `v-model` directive:
```html
<draggable v-model="myArray">
```

#### list
Type: `Array`<br>
Required: `false`<br>
Default: `null`

Alternative to the `value` prop, list is an array to be synchronized with drag-and-drop.<br>
The main difference is that `list` prop is updated by draggable component using splice method, whereas `value` is immutable.<br>
**Do not use in conjunction with value prop.**

#### All sortable options
New in version 2.19

Sortable options can be set directly as vue.draggable props since version 2.19.

This means that all [sortable option](https://github.com/RubaXa/Sortable#options) are valid sortable props with the notable exception of all the method starting by "on" as draggable component expose the same API via events.

kebab-case propery are supported: for example `ghost-class` props will be converted to `ghostClass` sortable option.

Example setting handle, sortable and a group option:
```HTML
<draggable
        v-model="list"
        handle=".handle"
        :group="{ name: 'people', pull: 'clone', put: false }"
        ghost-class="ghost"
        :sort="false"
        @change="log"
      >
      <!-- -->
</draggable>
```

#### tag
Type: `String`<br>
Default: `'div'`

HTML node type of the element that draggable component create as outer element for the included slot.<br>
It is also possible to pass the name of vue component as element. In this case, draggable attribute will be passed to the create component.<br>
See also [componentData](#componentdata) if you need to set props or event to the created component.

#### clone
Type: `Function`<br>
Required: `false`<br>
Default: `(original) => { return original;}`<br>

Function called on the source component to clone element when clone option is true. The unique argument is the viewModel element to be cloned and the returned value is its cloned version.<br>
By default vue.draggable reuses the viewModel element, so you have to use this hook if you want to clone or deep clone it.

#### move
Type: `Function`<br>
Required: `false`<br>
Default: `null`<br>

If not null this function will be called in a similar way as [Sortable onMove callback](https://github.com/RubaXa/Sortable#move-event-object).
Returning false will cancel the drag operation.

```javascript
function onMoveCallback(evt, originalEvent){
   ...
    // return false; — for cancel
}
```
evt object has same property as [Sortable onMove event](https://github.com/RubaXa/Sortable#move-event-object), and 3 additional properties:
 - `draggedContext`:  context linked to dragged element
   - `index`: dragged element index
   - `element`: dragged element underlying view model element
   - `futureIndex`:  potential index of the dragged element if the drop operation is accepted
 - `relatedContext`: context linked to current drag operation
   - `index`: target element index
   - `element`: target element view model element
   - `list`: target list
   - `component`: target VueComponent

HTML:
```HTML
<draggable :list="list" :move="checkMove">
```
javascript:
```javascript
checkMove: function(evt){
    return (evt.draggedContext.element.name!=='apple');
}
```
See complete example: [Cancel.html](https://github.com/SortableJS/Vue.Draggable/blob/master/examples/Cancel.html), [cancel.js](https://github.com/SortableJS/Vue.Draggable/blob/master/examples/script/cancel.js)

#### componentData
Type: `Object`<br>
Required: `false`<br>
Default: `null`<br>

This props is used to pass additional information to child component declared by [tag props](#tag).<br>
Value:
* `props`: props to be passed to the child component
* `attrs`: attrs to be passed to the child component
* `on`: events to be subscribe in the child component

Example (using [element UI library](http://element.eleme.io/#/en-US)):
```HTML
<draggable tag="el-collapse" :list="list" :component-data="getComponentData()">
    <el-collapse-item v-for="e in list" :title="e.title" :name="e.name" :key="e.name">
        <div>{{e.description}}</div>
     </el-collapse-item>
</draggable>
```
```javascript
methods: {
    handleChange() {
      console.log('changed');
    },
    inputChanged(value) {
      this.activeNames = value;
    },
    getComponentData() {
      return {
        on: {
          change: this.handleChange,
          input: this.inputChanged
        },
        attrs:{
          wrap: true
        },
        props: {
          value: this.activeNames
        }
      };
    }
  }
```

### Events

* Support for Sortable events:

  `start`, `add`, `remove`, `update`, `end`, `choose`, `unchoose`, `sort`, `filter`, `clone`<br>
  Events are called whenever onStart, onAdd, onRemove, onUpdate, onEnd, onChoose, onUnchoose, onSort, onClone are fired by Sortable.js with the same argument.<br>
  [See here for reference](https://github.com/RubaXa/Sortable#event-object-demo)

  Note that SortableJS OnMove callback is mapped with the [move prop](https://github.com/SortableJS/Vue.Draggable/blob/master/README.md#move)

HTML:
```HTML
<draggable :list="list" @end="onEnd">
```

* change event

  `change` event is triggered when list prop is not null and the corresponding array is altered due to drag-and-drop operation.<br>
  This event is called with one argument containing one of the following properties:
  - `added`:  contains information of an element added to the array
    - `newIndex`: the index of the added element
    - `element`: the added element
  - `removed`:  contains information of an element removed from to the array
    - `oldIndex`: the index of the element before remove
    - `element`: the removed element
  - `moved`:  contains information of an element moved within the array
    - `newIndex`: the current index of the moved element
    - `oldIndex`: the old index of the moved element
    - `element`: the moved element

### Slots

Limitation: neither header or footer slot works in conjunction with transition-group.

#### Header
Use the `header` slot to add none-draggable element inside the vuedraggable component.
Important: it should be used in conjunction with draggable option to tag draggable element.
Note that header slot will always be added before the default slot regardless its position in the template.
Ex:

``` html
<draggable v-model="myArray" draggable=".item">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="header" @click="addPeople">Add</button>
</draggable>
```

#### Footer
Use the `footer` slot to add none-draggable element inside the vuedraggable component.
Important: it should be used in conjunction with draggable option to tag draggable elements.
Note that footer slot will always be added after the default slot regardless its position in the template.
Ex:

``` html
<draggable v-model="myArray" draggable=".item">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="footer" @click="addPeople">Add</button>
</draggable>
```
 ### Gotchas
 
 - Vue.draggable children should always map the list or value prop using a v-for directive
   * You may use [header](https://github.com/SortableJS/Vue.Draggable#header) and [footer](https://github.com/SortableJS/Vue.Draggable#footer) slot to by-pass this limitation.
 
 - Children elements inside v-for should be keyed as any element in Vue.js. Be carefull to provide revelant key values in particular:
    * typically providing array index as keys won't work as key should be linked to the items content
    * cloned elements should provide updated keys, it is doable using the [clone props](#clone) for example


 ### Example 
  * [Clone](https://sortablejs.github.io/Vue.Draggable/#/custom-clone)
  * [Handle](https://sortablejs.github.io/Vue.Draggable/#/handle)
  * [Transition](https://sortablejs.github.io/Vue.Draggable/#/transition-example-2)
  * [Nested](https://sortablejs.github.io/Vue.Draggable/#/nested-example)
  * [Table](https://sortablejs.github.io/Vue.Draggable/#/table-example)
 
 ### Full demo example

[draggable-example](https://github.com/David-Desmaisons/draggable-example)

## For Vue.js 1.0

[See here](documentation/Vue.draggable.for.ReadME.md)

```
