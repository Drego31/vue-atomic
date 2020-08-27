/*!
 * @dbetka/vue-atomic v0.0.6
 * (c) dbetka
 * Released under the MIT License.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var IconEye = _interopDefault(require('vue-material-design-icons/Eye'));
var IconEyeOff = _interopDefault(require('vue-material-design-icons/EyeOff'));
var IconAlert = _interopDefault(require('vue-material-design-icons/Alert'));
var IconCheckBold = _interopDefault(require('vue-material-design-icons/CheckBold'));
var IconCancel = _interopDefault(require('vue-material-design-icons/ArrowDown'));

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var logical = {
  isUndefined: function isUndefined(value) {
    return typeof value === 'undefined';
  },
  isString: function isString(value) {
    return typeof value === 'string';
  },
  isNumber: function isNumber(value) {
    return typeof value === 'number';
  },
  isNull: function isNull(value) {
    return value === null;
  },
  isObject: function isObject(value) {
    return _typeof(value) === 'object' && logical.isNotNull(value);
  },
  isArray: function isArray(value) {
    return Array.isArray(value);
  },
  isFunction: function isFunction(value) {
    return typeof value === 'function';
  },
  isBoolean: function isBoolean(value) {
    return typeof value === 'boolean';
  },
  isDefined: function isDefined(value) {
    return logical.isUndefined(value) === false;
  },
  isNotString: function isNotString(value) {
    return logical.isString(value) === false;
  },
  isNotNumber: function isNotNumber(value) {
    return logical.isNumber(value) === false;
  },
  isNotNull: function isNotNull(value) {
    return logical.isNull(value) === false;
  },
  isNotObject: function isNotObject(value) {
    return logical.isObject(value) === false;
  },
  isNotArray: function isNotArray(value) {
    return logical.isArray(value) === false;
  },
  isNotFunction: function isNotFunction(value) {
    return logical.isFunction(value) === false;
  },
  isNotBoolean: function isNotBoolean(value) {
    return logical.isBoolean(value) === false;
  }
};

var vueModel = {
  get: function get() {
    return this.value;
  },
  set: function set(value) {
    this.$emit('input', value);
  }
};

var formMixin = {
  data: function data() {
    return {
      _errors: [],
      message: '',
      isSending: false,
      blockForm: false
    };
  },
  methods: {
    onErrorOccurs: function onErrorOccurs(errorMessage) {
      console.error(errorMessage);
      this.message = errorMessage.message;
      this.isSending = false;
      this.blockForm = false;
    }
  }
};

var validationMixin = {
  data: function data() {
    return {
      rules: {
        email: 'required|email',
        password: 'required|min:8|max:64|hasNumber|hasCapitalize',
        passwordConfirmation: 'required|confirmed:password',
        userTeam: 'required|min:4',
        eventId: 'required|length:4',
        pointId: 'required|length:4'
      }
    };
  }
};

var vModel = {
  props: {
    value: {}
  },
  computed: {
    vModel: vueModel
  }
};
var mixins = {
  vModel: vModel,
  form: formMixin,
  validation: validationMixin
};

var MFieldMixin = {
  props: {
    value: {},
    placeholder: String,
    name: String,
    maxlength: [String, Number],
    readonly: Boolean,
    required: Boolean,
    disabled: Boolean,
    mdCounter: [String, Number]
  },
  data: function data() {
    return {
      localValue: this.value,
      textareaHeight: false
    };
  },
  computed: {
    model: {
      get: function get() {
        return this.localValue;
      },
      set: function set(value) {
        var _this = this;

        if (value.constructor.toString().match(/function (\w*)/)[1].toLowerCase() !== 'inputevent') {
          this.$nextTick(function () {
            _this.localValue = value;
            _this.MField.hasInvalidValue = _this.isInvalidValue();
          });
        }
      }
    },
    clear: function clear() {
      return this.MField.clear;
    },
    attributes: function attributes() {
      return Object.assign(Object.assign({}, this.$attrs), {}, {
        type: this.type,
        id: this.id,
        name: this.name,
        disabled: this.disabled,
        required: this.required,
        placeholder: this.placeholder,
        readonly: this.readonly,
        maxlength: this.maxlength
      });
    }
  },
  watch: {
    model: function model() {
      this.setFieldValue();
    },
    clear: function clear(_clear) {
      if (_clear) {
        this.clearField();
      }
    },
    placeholder: function placeholder() {
      this.setPlaceholder();
    },
    disabled: function disabled() {
      this.setDisabled();
    },
    required: function required() {
      this.setRequired();
    },
    maxlength: function maxlength() {
      this.setMaxlength();
    },
    mdCounter: function mdCounter() {
      this.setMaxlength();
    },
    localValue: function localValue(val) {
      this.$emit('input', val);
    },
    value: function value(val) {
      this.localValue = val;
    }
  },
  methods: {
    clearField: function clearField() {
      this.$el.value = '';
      this.model = '';
      this.setFieldValue();
    },
    setLabelFor: function setLabelFor() {
      if (this.$el.parentNode) {
        var label = this.$el.parentNode.querySelector('label');

        if (label) {
          var forAttribute = label.getAttribute('for');

          if (!forAttribute || forAttribute.indexOf('md-') >= 0) {
            label.setAttribute('for', this.id);
          }
        }
      }
    },
    setFormResetListener: function setFormResetListener() {
      if (!this.$el.form) {
        return;
      }

      var parentForm = this.$el.form;
      parentForm.addEventListener('reset', this.onParentFormReset);
    },
    removeFormResetListener: function removeFormResetListener() {
      if (!this.$el.form) {
        return;
      }

      var parentForm = this.$el.form;
      parentForm.removeEventListener('reset', this.onParentFormReset);
    },
    onParentFormReset: function onParentFormReset() {
      this.clearField();
    },
    isInvalidValue: function isInvalidValue() {
      return this.$el.validity.badInput;
    },
    setFieldValue: function setFieldValue() {
      this.MField.value = this.model;
    },
    setPlaceholder: function setPlaceholder() {
      this.MField.placeholder = Boolean(this.placeholder);
    },
    setDisabled: function setDisabled() {
      this.MField.disabled = Boolean(this.disabled);
    },
    setRequired: function setRequired() {
      this.MField.required = Boolean(this.required);
    },
    setMaxlength: function setMaxlength() {
      if (this.mdCounter) {
        this.MField.counter = parseInt(this.mdCounter, 10);
      } else {
        this.MField.maxlength = parseInt(this.maxlength, 10);
      }
    },
    onFocus: function onFocus() {
      this.MField.focused = true;
    },
    onBlur: function onBlur() {
      this.MField.focused = false;
    }
  },
  created: function created() {
    this.setFieldValue(); // this.setPlaceholder()
    // this.setDisabled()
    // this.setRequired()
    // this.setMaxlength()
  },
  mounted: function mounted() {
    this.setLabelFor();
    this.setFormResetListener();
  },
  beforeDestroy: function beforeDestroy() {
    this.removeFormResetListener();
  }
};

//
var script = {
  name: 'a-input',
  mixins: [MFieldMixin, mixins.vModel],
  inject: ['MField'],
  props: {
    id: {
      type: String,
      "default": function _default() {
        return 'a-input-' + Math.random().toString(36).slice(4);
      }
    },
    type: {
      type: String,
      "default": 'text'
    }
  },
  computed: {
    toggleType: function toggleType() {
      return this.MField.typePassword;
    },
    isPassword: function isPassword() {
      return this.type === 'password';
    },
    listeners: function listeners() {
      var l = Object.assign({}, this.$listeners);
      delete l.input;
      return l;
    },
    additionalClasses: function additionalClasses() {
      return {
        'f-filled': this.vModel !== '',
        'f-error': this.error,
        'f-correct': this.correct,
        'f-icon': this.error || this.isPassword
      };
    }
  },
  watch: {
    type: function type(_type) {
      this.setPassword(this.isPassword);
    },
    toggleType: function toggleType(toggle) {
      if (toggle) {
        this.setTypeText();
      } else {
        this.setTypePassword();
      }
    }
  },
  methods: {
    setPassword: function setPassword(state) {
      this.MField.typePassword = state;
      this.MField.showPassword = false;
    },
    setTypePassword: function setTypePassword() {
      this.$el.type = 'password';
    },
    setTypeText: function setTypeText() {
      this.$el.type = 'text';
    }
  },
  created: function created() {
    this.setPassword(this.isPassword);
    this.$attrs.slot = 'input';
    console.log(this.$attrs);
  },
  beforeDestroy: function beforeDestroy() {
    this.setPassword(false);
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('input', _vm._g({
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vModel,
      expression: "vModel"
    }],
    staticClass: "a-input",
    "class": _vm.additionalClasses,
    attrs: {
      "id": _vm.id
    },
    domProps: {
      "value": _vm.vModel
    },
    on: {
      "focus": _vm.onFocus,
      "blur": _vm.onBlur,
      "input": function input($event) {
        if ($event.target.composing) {
          return;
        }

        _vm.vModel = $event.target.value;
      }
    }
  }, _vm.listeners));
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
var script$1 = {
  name: 'a-label',
  inject: ['MField'],
  computed: {
    hasValue: function hasValue() {
      return this.MField.value;
    },
    isFocused: function isFocused() {
      return this.MField.focused;
    },
    isDisabled: function isDisabled() {
      return this.MField.disabled;
    },
    classes: function classes() {
      return {
        'f-reduced': this.hasValue || this.isFocused,
        'f-focused': this.isFocused,
        'f-disabled': this.isDisabled
      };
    }
  }
};

/* script */
var __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('label', {
    staticClass: "a-label f-field",
    "class": _vm.classes
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = undefined;
/* functional template */

var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

//
var script$2 = {
  name: 'm-field',
  components: {
    IconEye: IconEye,
    IconEyeOff: IconEyeOff,
    IconAlert: IconAlert,
    IconCheckBold: IconCheckBold
  },
  props: {
    disabled: {
      type: Boolean,
      "default": false
    },
    placeholder: {
      type: String,
      "default": ''
    },
    type: {
      type: String,
      "default": ''
    },
    error: {
      type: Boolean,
      "default": false
    },
    correct: {
      type: Boolean,
      "default": false
    },
    assist: {
      type: String,
      "default": ''
    }
  },
  data: function data() {
    return {
      MField: {
        value: null,
        showPassword: false,
        typePassword: false,
        focused: false,
        disabled: false,
        correct: false,
        error: true
      },
      id: '',
      showPassword: false
    };
  },
  provide: function provide() {
    return {
      MField: this.MField
    };
  },
  computed: {
    isPassword: function isPassword() {
      return this.MField.typePassword === true;
    },
    additionalClasses: function additionalClasses() {
      return {
        'f-filled': this.vModel !== '',
        'f-error': this.error,
        'f-correct': this.correct,
        'f-icon': this.error || this.typePassword
      };
    },
    getType: function getType() {
      if (this.isPassword) {
        return this.showPassword ? '' : this.type;
      } else {
        return this.type;
      }
    }
  },
  mounted: function mounted() {
    console.log(this);
  }
};

/* script */
var __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "m-field"
  }, [_vm._t("default"), _vm._v(" "), _vm.isPassword && _vm.showPassword === false ? _c('icon-eye', {
    staticClass: "a-icon f-input",
    attrs: {
      "size": 26
    },
    on: {
      "click": function click($event) {
        _vm.showPassword = true;
      }
    }
  }) : _vm._e(), _vm._v(" "), _vm.isPassword && _vm.showPassword ? _c('icon-eye-off', {
    staticClass: "a-icon f-input",
    attrs: {
      "size": 26
    },
    on: {
      "click": function click($event) {
        _vm.showPassword = false;
      }
    }
  }) : _vm._e(), _vm._v(" "), _vm.error && _vm.isPassword === false ? _c('icon-alert', {
    staticClass: "a-icon f-input f-error",
    attrs: {
      "size": 26
    }
  }) : _vm._e(), _vm._v(" "), _vm.correct && _vm.isPassword === false && _vm.error === false ? _c('icon-check-bold', {
    staticClass: "a-icon f-input f-correct",
    attrs: {
      "size": 26
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "a-assist",
    "class": {
      'f-error': _vm.error
    }
  }, [_vm._v("\n      " + _vm._s(_vm.assist) + "\n    ")])], 2);
};

var __vue_staticRenderFns__$2 = [];
/* style */

var __vue_inject_styles__$2 = undefined;
/* scoped */

var __vue_scope_id__$2 = undefined;
/* module identifier */

var __vue_module_identifier__$2 = undefined;
/* functional template */

var __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$2 = normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

//
var script$3 = {
  name: 'm-select',
  components: {
    IconCancel: IconCancel
  },
  mixins: [mixins.vModel],
  props: {
    /**
     * options: [{label: String, value: String}]
     */
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      "default": ''
    },
    error: {
      type: Boolean,
      "default": false
    },
    correct: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      id: '',
      optionsAreOpen: false,
      optionsAreOutsideWindow: false,
      pointedOption: -1
    };
  },
  mounted: function mounted() {
    var randomNumber = Math.floor(Math.random() * 10000);
    this.id = 'id-select-' + randomNumber;
    this.resetPointedOption();
  },
  computed: {
    label: function label() {
      var _this = this;

      var option = this.options.find(function (option) {
        return option.value === _this.vModel;
      });
      return option ? option.label : '';
    },
    additionalClasses: function additionalClasses() {
      return {
        'f-filled': this.label !== '',
        'f-error': this.error,
        'f-correct': this.correct
      };
    }
  },
  methods: {
    resetPointedOption: function resetPointedOption() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.vModel;

      if (logical.isNull(value)) {
        this.pointedOption = -1;
      } else {
        this.pointedOption = this.options.findIndex(function (option) {
          return option.value === value;
        });
      }
    },
    focusAndToggle: function focusAndToggle() {
      this.$refs.input.focus();
      this.toggleOptions();
    },
    closeOptions: function closeOptions() {
      var _this2 = this;

      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        resetPointedOption: true
      };
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this2.optionsAreOpen = false;

          if (config.resetPointedOption) {
            _this2.resetPointedOption();
          }

          resolve();
        });
      });
    },
    toggleOptions: function toggleOptions() {
      var _this3 = this;

      this.optionsAreOpen = this.optionsAreOpen === false;
      this.resetPointedOption();

      if (this.optionsAreOpen) {
        this.$nextTick(function () {
          var options = _this3.$refs.options;
          var optionsProps = options.getBoundingClientRect();
          var optionsHeight = optionsProps.height;
          var optionsTop = optionsProps.top;
          var windowHeight = window.outerHeight;
          _this3.optionsAreOutsideWindow = optionsHeight + optionsTop + 8 >= windowHeight;
        });
      } else {
        this.optionsAreOutsideWindow = false;
      }
    },
    chooseOption: function chooseOption(_ref) {
      var _this4 = this;

      var value = _ref.value,
          index = _ref.index;

      if (logical.isDefined(index)) {
        value = this.options[index].value;
      }

      this.closeOptions({
        resetPointedOption: false
      }).then(function () {
        _this4.$emit('change', value);

        _this4.vModel = value;

        _this4.resetPointedOption(value);
      });
    },
    chooseAndToggleOptions: function chooseAndToggleOptions() {
      var index = this.pointedOption;

      if (this.optionsAreOpen && index >= 0) {
        this.chooseOption({
          index: index
        });
      } else {
        this.toggleOptions();
      }
    },
    optionSwitch: function optionSwitch(index) {
      if (this.optionsAreOpen === false) {
        this.chooseOption({
          index: index
        });
      }
    },
    optionUp: function optionUp() {
      if (this.pointedOption - 1 < 0) {
        this.pointedOption = this.options.length - 1;
      } else {
        this.pointedOption -= 1;
      }

      this.optionSwitch(this.pointedOption);
    },
    optionDown: function optionDown() {
      if (this.pointedOption + 1 > this.options.length - 1) {
        this.pointedOption = 0;
      } else {
        this.pointedOption += 1;
      }

      this.optionSwitch(this.pointedOption);
    }
  }
};

/* script */
var __vue_script__$3 = script$3;
/* template */

var __vue_render__$3 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "m-input f-relative"
  }, [_c('div', {
    directives: [{
      name: "click-outside",
      rawName: "v-click-outside",
      value: _vm.closeOptions,
      expression: "closeOptions"
    }],
    staticClass: "a-field f-select",
    "class": _vm.additionalClasses,
    on: {
      "click": _vm.toggleOptions
    }
  }, [_c('input', {
    ref: "input",
    staticClass: "a-input f-select",
    "class": _vm.additionalClasses,
    attrs: {
      "id": _vm.id,
      "readonly": ""
    },
    domProps: {
      "value": _vm.label
    },
    on: {
      "focusout": _vm.closeOptions,
      "keyup": [function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
          return null;
        }

        $event.preventDefault();
        return _vm.closeOptions($event);
      }, function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter") && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
          return null;
        }

        $event.preventDefault();
        return _vm.chooseAndToggleOptions($event);
      }, function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
          return null;
        }

        $event.preventDefault();
        return _vm.optionUp($event);
      }, function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
          return null;
        }

        $event.preventDefault();
        return _vm.optionDown($event);
      }]
    }
  })]), _vm._v(" "), _c('label', {
    staticClass: "a-label f-field",
    "class": {
      'f-correct': _vm.correct,
      'f-error': _vm.error
    },
    attrs: {
      "for": _vm.id
    }
  }, [_vm._v("\n    " + _vm._s(_vm.placeholder) + "\n  ")]), _vm._v(" "), _c('icon-cancel', {
    staticClass: "a-icon f-input",
    attrs: {
      "size": 26
    },
    on: {
      "click": function click($event) {
        $event.stopPropagation();
        return _vm.focusAndToggle($event);
      }
    }
  }), _vm._v(" "), _vm.optionsAreOpen ? _c('div', {
    ref: "options",
    staticClass: "m-options",
    "class": {
      'f-top': _vm.optionsAreOutsideWindow
    }
  }, _vm._l(_vm.options, function (option, index) {
    return _c('div', {
      key: option.value,
      staticClass: "a-option",
      "class": {
        'f-selected': option.value === _vm.vModel,
        'f-pointed': _vm.pointedOption === index
      },
      on: {
        "click": function click($event) {
          return _vm.chooseOption(option);
        }
      }
    }, [_vm._v("\n      " + _vm._s(option.label) + "\n    ")]);
  }), 0) : _vm._e()], 1);
};

var __vue_staticRenderFns__$3 = [];
/* style */

var __vue_inject_styles__$3 = undefined;
/* scoped */

var __vue_scope_id__$3 = undefined;
/* module identifier */

var __vue_module_identifier__$3 = undefined;
/* functional template */

var __vue_is_functional_template__$3 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$3 = normalizeComponent({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

var script$4 = {
  name: 'm-resize-auto',
  methods: {
    resize: function resize(event) {
      event.target.style.height = 'auto';
      event.target.style.height = "".concat(event.target.scrollHeight + 4, "px");
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.$el.setAttribute('style', 'height', "".concat(_this.$el.scrollHeight + 4, "px"));
    });
  },
  render: function render() {
    return this.$scopedSlots["default"]({
      resize: this.resize
    });
  }
};

/* script */
var __vue_script__$4 = script$4;
/* template */

/* style */

var __vue_inject_styles__$4 = undefined;
/* scoped */

var __vue_scope_id__$4 = undefined;
/* module identifier */

var __vue_module_identifier__$4 = undefined;
/* functional template */

var __vue_is_functional_template__$4 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$4 = normalizeComponent({}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, undefined, undefined);

//
var script$5 = {
  name: 'm-textarea',
  mixins: [mixins.vModel],
  components: {
    MResizeAuto: __vue_component__$4,
    IconAlert: IconAlert,
    IconCheckBold: IconCheckBold
  },
  props: {
    placeholder: {
      type: String,
      "default": ''
    },
    type: {
      type: String,
      "default": ''
    },
    error: {
      type: Boolean,
      "default": false
    },
    correct: {
      type: Boolean,
      "default": false
    },
    assist: {
      type: String,
      "default": ''
    }
  },
  data: function data() {
    return {
      id: '',
      showPassword: false
    };
  },
  mounted: function mounted() {
    var randomNumber = Math.floor(Math.random() * 10000);
    this.id = 'id-input-' + randomNumber;
  },
  computed: {
    isPassword: function isPassword() {
      return this.type === 'password';
    },
    additionalClasses: function additionalClasses() {
      return {
        'f-filled': this.vModel !== '',
        'f-error': this.error,
        'f-correct': this.correct,
        'f-icon': this.error || this.isPassword
      };
    },
    getType: function getType() {
      if (this.isPassword) {
        return this.showPassword ? '' : this.type;
      } else {
        return this.type;
      }
    }
  }
};

/* script */
var __vue_script__$5 = script$5;
/* template */

var __vue_render__$4 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "m-field"
  }, [_c('m-resize-auto', {
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(ref) {
        var resize = ref.resize;
        return [_c('textarea', {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: _vm.vModel,
            expression: "vModel"
          }],
          staticClass: "a-field f-textarea",
          "class": _vm.additionalClasses,
          attrs: {
            "id": _vm.id,
            "type": _vm.getType
          },
          domProps: {
            "value": _vm.vModel
          },
          on: {
            "input": [function ($event) {
              if ($event.target.composing) {
                return;
              }

              _vm.vModel = $event.target.value;
            }, resize]
          }
        })];
      }
    }])
  }), _vm._v(" "), _c('label', {
    staticClass: "a-label f-field",
    "class": {
      'f-correct': _vm.correct,
      'f-error': _vm.error
    },
    attrs: {
      "for": _vm.id
    }
  }, [_vm._v("\n    " + _vm._s(_vm.placeholder) + "\n  ")]), _vm._v(" "), _vm.error ? _c('icon-alert', {
    staticClass: "a-icon f-input f-error",
    attrs: {
      "size": 26
    }
  }) : _vm._e(), _vm._v(" "), _vm.correct && _vm.error === false ? _c('icon-check-bold', {
    staticClass: "a-icon f-input f-correct",
    attrs: {
      "size": 26
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "a-assist",
    "class": {
      'f-error': _vm.error
    }
  }, [_vm._v("\n    " + _vm._s(_vm.assist) + "\n  ")])], 1);
};

var __vue_staticRenderFns__$4 = [];
/* style */

var __vue_inject_styles__$5 = undefined;
/* scoped */

var __vue_scope_id__$5 = undefined;
/* module identifier */

var __vue_module_identifier__$5 = undefined;
/* functional template */

var __vue_is_functional_template__$5 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$5 = normalizeComponent({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);

var components = {
  AInput: __vue_component__,
  ALabel: __vue_component__$1,
  MField: __vue_component__$2,
  MSelect: __vue_component__$3,
  MTextarea: __vue_component__$5
};
var index = Object.assign(Object.assign({}, components), {}, {
  install: function install(Vue, options) {
    for (var componentName in components) {
      var component = components[componentName];
      Vue.component(component.name, component);
    }
  }
});

module.exports = index;
