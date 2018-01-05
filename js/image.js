define([ 'jquery', 'filesaver', 'canvastoblob' ], function($, FileSaver, CanvasToBlob) {
    var canvas = $('canvas.image')[0];
    var context = canvas.getContext('2d', { alpha: false });
    var width = canvas.width;
    var height = canvas.height;

    var left, right;

    function loadImages(loadCallback) {
        if (!left) {
            left = new Image();
            left.onload = function () {
                right = new Image();
                right.onload = function () {
                    loadCallback();
                }
                right.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAABtCAMAAADQzBKcAAAC+lBMVEUGBgYAAAD///////////////////////////////9wcHCfn59jY2MzNDT////////////////y8vJpaWn////////////////+/v7//v7///+ys7Ofn5/Z2dmlpaVzc3M8PDzJycmIiIhVVVWPjo7////+/v7////z8/P////////z8/Pc3d3l5eXj4+PIyMj////29/fZ2dnX19f09PT///+xsbGhoaGSkpK3uLja2tqnp6e1tbUhICD////4+Pjv7+/5+fn////t7e3Y2Nj9/f3n5+fk5OT+/v729vbY2dn////q6ur////V1dXf39/Z2dnx8fHMzMy3t7fCwsLa2tqurq7Pz8+enp79/f3V1tbGxsbY2Nivr6/8/PzOzs7Q0NDFxcWRkpLk5OSsrKzKysp4eHisrKx3d3e0tLRubm5jZGSWlZWGhoa2trako6OQkJBKSkr6+vr7/Pzy8vLw8PDi4uL////////19fX6+/vx8fHj4+P////w8PD+/v7r6+vMzc3i4uLOzs7BwcHz8/Pu7u7+/v7Qz8/Ky8vu7e3FxcXZ2dm+vr7g4OCDg4Pr6+v9/f28vLydnZ2IiIijo6Pm5uaXl5e/v7/T09OUlZXf39/f3t6fn5+Dg4Pw8PCXlpaZmZmBgoLq6upWV1fGx8ft7e37+/v19fXo6Ojw8PDW1tbt7e329/fg4eH3+PjKycnp6en29vbQz8/IyMjf39/09PTBwMDo5+fc3d3a2Ni9vb2en5+vr6/////e3t6oqKj////p6Ojz8/PS0tLl5eWoqKj///+ysrKurq7v7+94eHizs7Px8fHa2tq8vLz////q6upcXFx0dHT///93d3dHR0evr6/19fXq6+v4+Pj39/fT09P29vb09PTExcXOzs7i4+PZ2trt7u60tLTs7e3Kysrv7++8vLyur6/Dw8P6+vrj4+OhoaHIyMhvb2+MjIxycnLs7Oz///+FhYX////r6+uFhYXj4+OjoqLJycnIyMhGRkb////+0kWLAAAA/XRSTlMCAPb49Pv88ObdBxAPBOzY1btuGOnQs66tmm8+ODImFREPDQwE49TOzcC3t5WOiIiFhXhpZlFLRj80FhUICODMy8G+trCjo6Gfn5WUj46KgoB4dnJw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';
            };
            left.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAABtCAMAAADQzBKcAAACRlBMVEVycnL///////////////////9cXV1qamr////////+/v7////////+/v7x8fHY2dmcnJyzs7Pf399WVlb////09PT////+//////+RkZGUlJSoqKj////v7+/4+Pj+/v7j4+P////7+/uwsLCysrKam5unqKhwcHCbmpqjo6OPj4+ztLTCwcFAQEA8PDz////r6+vn5+fMzMzl5OTc3d3Z2trz8/PIyMj////Jycna2trl5OS6urrx8fHCwsLIyMi/v7////+rq6u0tLSgoaF9fn5tbW3a2tqIiIimpqb5+fn////19fX////u7u7w8PD+/v7j4+Pr7Oz////r6+v////l5eXV1dX29vbf39/Z2dnOzs7Y2Nja2tqurq6enp6Ghobt7Oz8/PzX2Nj8/PzW1tbQ0NDo5+fe3t7o6Ojd3d14eHiEhIR3d3ddXl5dXV36+vr5+fns7e3y8vL29vb////i4uL////V1dXy8vL19fXX19fn5+fj4+P4+Pja29v08/Py8vL////+/f3Oz8/BwcHc29vu7u69vb3+/v6vr6+mpqbOzs7FxcXPzs708/PFxcWjo6OYl5d2dnaIiIi/v7/Ozs7////CwsLf3t7////p6elGR0fq6upwcHDGx8eJiYnCwsLg4eHx8fHNzc3NzMzKysr3+Pi5ubmen5/////9/f3l5eWoqKj///+ysrKurq7W1tbv7+/x8fGlpKTR0dFcXFy9vr7JycmWlZX4+PjExcXDw8Kur6////9vb2+Tk5P///9OTaooAAAAwXRSTlMB9/z0+eUGDevVr/DN2ndoGTIxFNzOu7OqRz4Q383Bn4lvZ1hLST0xLSYjHRIRCcHAo5qWlZSLiIV7eHdwb29bVlFEPjgrFxYQBsu9ubezqaOhnZSPjo6KhIKAgHFsbGhkYmBgWFVSTUxHREA7Nyga+evn3NbQ0MbFwbSysKqpp6Gdm5mRjYuIhYF5dnNzaWhjV1VVVExLRUI+OTckIyMgFgq8ubSppJ+bgnp2bmtqZWJbWVJLPjw1KyDlwpiJeGY0/As3aQAABdtJREFUGBmNwQOTJGsahuHn/TILbdt2j23btm37jG1bx7aX9z/b6tOzsbERU5l1XUqua4/+583g5Qrz6VW9E91UksEahVjOUvXaUAlkRRVsK/RXj4pi8D1yFGxqIZxWQkUWvhl9FGIhHn9XQglmRkabgrUbxpeSmnCeYU8VYgmeUS+pBgcHWxUmDfMpk1QCWV8rVDkYkQLp39+ub44q3DXMY4b0tFGhWrslncOM0fotX6F2xl9JKsHYNzl3yrSmurpNE6dIUSUzgFWSSjFGKG9ZnB6RSLqSyY0wU9JiODwlvxqcme9gjZLJgchUqQnG536IeWYG+5qV1BkcOySlD5mwIUKvz6YqqWlpGGsltdW3q2D13Krpc4e3K8BOnLFa0ohGpWQDZoyUWtYpNUMxY7W6b3dJrx9vvv/9+R8VqBQz1mrs89iSLEeCP0mB0jHHr13jfnIkOGhWsI8xIpPLs8E8M1iv5H4rkJSOx4mJP/TFM4OMJgVIGyBpKB438obRw9XsUYDcvUyUxkPW6OxfLhZlpa9sV6DnUC2pmLOrdisV94AmKS9z6D31KogqyAqMU5LG1exRj/yS4Qo0CCNeINUtkRQbVQTlCjQQc5RJtTsUW54BzFawgZhxXa0LNT4OvqNMwQZixj90s3ErmBnzFGIYZvTXqO/24plHpEAhHuCMIW3Zs/HM8PIV5jkYa3YtqMTzychXqNw4xrKtg0n4MFcpKMXnq0fLiB/brBCxZ0ooh/0j5+R1FEiKditIZ2ShEmo5PuIb/WXuDgXpjHBFCQPO3H6hhNdZvFKQikL4SglXZyvhSQaHFGhaGlAuacUnknKAOQp2BI9MSWuHSdlg3FCwzzGfW9K6Mo0GD1oUbDhmpEmLdr8GM2YqxBOcOe5r6Mt0zByNChGrxIz5ergNZx7pCtUPM4pe/DwCM6xNocpwxv6yHz7CgzFKwSGMfZs2HQZWKRUb8Mmob/4bkZ+lyRsVrhgy6iYMyY5JWpimcBVp7K0/16GE7RxQCmJLCofeUcKbCAeVmpL1SvgIqhQkt6ROvYb9U9JwjOMK8raSwu3qse1bKc/hsUCB0oEFSnh8U5qNGSMVaB0epEt6fFGN+IabpEC5ccwolZ4O0geYUa0QFzDzqVXe0ikRzPhGISYZZjBBKx4ZRmVMYQZi5nFEwy5ijhyF6sjAM5+xtwb6Piel1l0KkYNvxoWGpYVkxqRBxxWmH75RNaR+blFUUqEfVZhi8L0Fl7cXSBoPExSqPzAn/YES+sEXCjex/6xFmb9KehOH+UrNoZuS1uFTrdRsPCGpFGO6UjN11m7FIhjTlaJza9WMM6oVqHvKW/W6e1r1+MZZBYplZhR9kP2HpGjp1GzM+EIdMQX4gAT/sw7pUkMO5ihTzQgFmAieOWyMdl1owif+Vn2ZrACDsAQYrGsj98N56TBnFSCahWfmOVbnZc+DVkUrcZMUoMXDM/Pgp5wVLJZeejBIQcrBEihaNXpju7QNKIwpSLmHb2YsX7ZU0hacT6MC7U4DHN6Ay5Ie4IxRCpFzxMGfX2fele7jjE8U6sXOXd0a26dbd3FGX6Vo0efaijOqpFvblIri5gqHUSXVMkop2NFn2sd4HJXGwXmlYPiQ8TguS20+LFJyndvHbRz3pELqV7cYxkpdcRxj9X5tV4/F6RGfuUWL7xz1uiT1wSMrqvdqAJxvvgNO5A8YsyUqaT7mM1Lvdw2sl09aw8nbSriDb2QqiXseWC8Ofle0RdLvYI4JSmLyPMCZmWf0HcwYSTMw44qSau2XwV/8NZqU2V/6HmecVoCuR5fSZ82szVVCcWZM0/EoVqquxB8qDWYoZS+Pnsn/lJNKTefv+Z3TVs6/vvJHpeCP7OqIOQ5cyqkdnP6LwnTUGO+4OSurmDGqU0HWG8486+H52JiWG8cyZ325s0JJlIL9l+eoUcKr66fSMvvk6b0aDtDD+Y6EU3on2jK6RUk8nJfm6OH13azURNufNfxr87M9+n//AXNfMAs1wAMOAAAAAElFTkSuQmCC';
        } else {
            loadCallback();
        }
    }

    function refresh(award, refreshedCallback) {
        loadImages(function () {
            context.fillStyle = 'rgba(0, 0, 0, 1.0)';
            context.fillRect(0, 0, width, height);

            context.drawImage(left, 0, (height - left.height) * 0.5);
            context.drawImage(right, width - right.width, (height - right.height) * 0.5);
            
            context.fillStyle = 'rgba(255, 255, 255, 1.0)';
            context.textAlign = 'center';

            context.font = 'bold 13pt "Raleway", "Helvetica Neue", Helvetica, Arial, sans-serif';
            context.fillText(award.position, width * 0.5, 45);

            context.font = '9pt "Raleway", "Helvetica Neue", Helvetica, Arial, sans-serif';
            context.fillText(award.category, width * 0.5, 65);

            context.fillText(award.festival, width * 0.5, 94);

            context.strokeStyle = 'rgba(255, 255, 255, 1.0)';
            context.beginPath();
            context.moveTo(51, 76-0.5);
            context.lineTo(210, 76-0.5);
            context.stroke();

            refreshedCallback();
        });
    }

    function save(award) {
        refresh(award, function () {
            canvas.toBlob(function (blob) {
                saveAs(blob, 'award.png');
            });
        });
    }

    return {
        save: save,
        refresh: refresh
    }
});
