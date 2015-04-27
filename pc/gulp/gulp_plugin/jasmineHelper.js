var convertUtils = require("./convertUtils");

beforeEach(function () {
    function _isSpyed(method) {
        return !!method.calls;
    }

    this.addMatchers({
        toBeFunction: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: Object.prototype.toString.call(actual, null) === "[object Function]"
                    }
                }
            };
        },
        toBeString: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: Object.prototype.toString.call(actual, null) === "[object String]"
                    }
                }
            };
        },
        toBeArray: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: Object.prototype.toString.call(actual, null) === "[object Array]"
                    }
                }
            };
        },
        toBeNumber: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: Object.prototype.toString.call(actual, null) === "[object Number]"
                    }
                }
            };
        },
        toBeSame: function (expected) {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: actual === expected
                    }
                }
            };
        },
        //判断是否为jQuery对象
        toBejQuery: function () {
            return {
                compare: function (actual, expected) {
                    if (!jQuery) {
                        throw new Error("jQuery未定义！");
                    }

                    return {
                        pass: actual instanceof jQuery
                    }
                }
            };
        },
        //判断是否为canvas对象
        toBeCanvas: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: Object.prototype.toString.call(actual) === "[object HTMLCanvasElement]"
                    }
                }
            };
        },
        toBeInstanceOf: function (expected) {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: actual instanceof expected
                    }
                }
            };
        },
        //判断是否为同一个数组（引用同一个数组）
        toBeSameArray: function (expected) {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: actual === expected
                    }
                }
            };
        },
        toBeExist: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: actual !== undefined && actual !== null
                    }
                }
            };
        },
//        //jasmine的原生方法toBeFalsy有问题：
//        //expect(undefined).toBeFalsy();    //通过！
//        //所以用我的方法覆盖原方法。
//        toBeFalsy: function () {
//            return {
//                compare: function (actual, expected) {
//                    return {
//                        pass:  actual === false
//                    }
//                }
//            };
//        },
        //包含字符串
        toContain: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: actual.indexOf(expected) >= 0
                    }
                },
                negativeCompare: function(actual, expected){
                    return {
                        pass: actual.indexOf(expected) === -1
                    }
                }
            };
        },
        /**
         * judge whether both type is equal(recursion)

         expect({a: 1, b: {c: ""}}).toTypeEqual({a: 2, b:{c: "aaa"}});  //通过

         * @param expected
         * @returns
         */
        toTypeEqual: function () {
            return {
                compare: function (actual, expected) {
                    var like = function (expected, actual) {
                        var i = null,
                            toStr = Object.prototype.toString,
                            sArr = "[object Array]",
                            sOb = "[object Object]",
                            type = null;

                        for (i in expected) {
                            if (expected.hasOwnProperty(i)) {
                                type = toStr.call(expected[i]);

                                if (type !== toStr.call(actual[i])) {
                                    return false;
                                }

                                if (type === sArr || type === sOb) {
                                    if (!arguments.callee(expected[i], actual[i])) {
                                        return false;
                                    }
                                }
                            }
                        }

                        return true;
                    }

                    return {
                        pass: like(expected, actual)
                    }
                }
            };
        },
        /**
         * 判断是否进行了断言
         * 用法：expect(function(){xxx}).toAssert();
         * @param expected
         * @returns {boolean}
         */
        toAssert: function () {
            return {
                compare: function (actual, expected) {
                    if (!_isSpyed(YE.assert)) {
                        spyOn(YE, "assert");
                    }

                    actual();

                    if (expected) {
                        return {
                            pass: YE.assert.calls.any() === true
                            && YE.assert.calls.mostRecent().args[0] === false
                            && YE.assert.calls.mostRecent().args[1] === expected
                        }
                    }

                    return {
                        pass: YE.assert.calls.any() === true && YE.assert.calls.mostRecent().args[0] === false
                    }
                }
            };
        }
    })
    ;


//* sinon matcher
    (function (jasmine) {
        function _isSpecificCall(stub) {
            return !stub.firstCall
        }


        jasmine.addMatchers({
            toCalledWith: function () {
                return {
                    compare: function (actual, expected) {
                        var actualArg = null,
                            expectedArg = null;

                        actualArg = _isSpecificCall(actual) ? actual.args : actual.args[0];
                        expectedArg = Array.prototype.slice.call(arguments, 1);

                        return {
                            pass: actual.calledWith.apply(actual, expectedArg),
                            message: "Expected to called with " + convertUtils.toString(expectedArg).slice(1, -1)
                            + ", actual is " + convertUtils.toString(actualArg).slice(1, -1)
                        }
                    }
                };
            },
            toCalled: function () {
                return {
                    compare: function (actual, expected) {
                        return {
                            pass: actual.called,
                            message: "Expected to be called, but actual is not called"
                        }
                    }
                };
            },
            toCalledOnce: function () {
                return {
                    compare: function (actual, expected) {
                        return {
                            pass: actual.calledOnce,
                            message: "Expected to be called Once, but actual callCount is " + actual.callCount
                        }
                    }
                };
            },
            toCalledTwice: function () {
                return {
                    compare: function (actual, expected) {
                        return {
                            pass: actual.calledTwice,
                            message: "Expected to be called Twice, but actual callCount is " + actual.callCount
                        }
                    }
                };
            },
            toCalledThrice: function () {
                return {
                    compare: function (actual, expected) {
                        return {
                            pass: actual.calledThrice,
                            message: "Expected to be called Thrice, but actual callCount is " + actual.callCount
                        }
                    }
                };
            },
            toCalledBefore: function () {
                return {
                    compare: function (actual, expected) {
                        var msg = null;

                        msg = "Expected to be called before, ";
                        msg += actual.called ? "but actual is be called after" : "but actual is not called";

                        return {
                            pass: actual.calledBefore(expected),
                            message: msg
                        }
                    }
                };
            },
            toCalledAfter: function () {
                return {
                    compare: function (actual, expected) {
                        var msg = null;

                        msg = "Expected to be called after, ";
                        msg += actual.called ? "but actual is be called before" : "but actual is not called";

                        return {
                            pass: actual.calledAfter(expected),
                            message: msg
                        }
                    }
                };
            }
        });
    }(this));
});