/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.83474637160512, "KoPercent": 0.16525362839488433};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4176605834171576, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4939516129032258, 500, 1500, "获取Projects首页"], "isController": false}, {"data": [0.4910404624277457, 500, 1500, "随机获取分类列表"], "isController": false}, {"data": [0.49635650224215244, 500, 1500, "获取MAKERABLES主页"], "isController": false}, {"data": [0.45504962054874487, 500, 1500, "随机点赞一个作品"], "isController": false}, {"data": [0.49544159544159544, 500, 1500, "浏览MAKERABLES主页，浏览完毕"], "isController": false}, {"data": [0.4952058657642414, 500, 1500, "浏览MAKERABLES主页，开始滚动浏览"], "isController": false}, {"data": [0.0, 500, 1500, "随机收藏一个作品"], "isController": false}, {"data": [0.4024956471271039, 500, 1500, "随机查看一个作品详情页"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13918, 23, 0.16525362839488433, 1010.0469176605831, 516, 7537, 802.0, 1754.1000000000004, 1916.0499999999993, 2635.239999999998, 23.15691396436118, 204.16284239399448, 98.70498840272117], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["获取Projects首页", 1736, 0, 0.0, 690.7183179723501, 516, 3377, 634.0, 873.0, 1002.1499999999999, 1550.039999999999, 2.9669330525912807, 28.771610231454105, 12.49936444226444], "isController": false}, {"data": ["随机获取分类列表", 1730, 0, 0.0, 842.3994219653172, 628, 3507, 784.5, 1053.8000000000002, 1188.4499999999998, 2030.2500000000014, 2.9814221211181193, 59.3840577661307, 12.532775918876883], "isController": false}, {"data": ["获取MAKERABLES主页", 1784, 0, 0.0, 728.3778026905828, 544, 4684, 632.0, 1023.0, 1106.5, 1414.0500000000006, 2.9777304486291425, 16.07158719479932, 12.530312991350561], "isController": false}, {"data": ["随机点赞一个作品", 1713, 9, 0.5253940455341506, 1199.454757734968, 654, 5452, 1056.0, 1469.0, 1797.0999999999997, 3803.5599999999854, 2.9858290774084466, 3.192267080711509, 12.826818468281012], "isController": false}, {"data": ["浏览MAKERABLES主页，浏览完毕", 1755, 0, 0.0, 673.1669515669518, 538, 3189, 618.0, 829.6000000000004, 995.5999999999995, 1433.88, 2.9715040381977955, 13.280714272108497, 12.913274384746279], "isController": false}, {"data": ["浏览MAKERABLES主页，开始滚动浏览", 1773, 0, 0.0, 703.5487873660456, 547, 3900, 634.0, 912.0, 1029.0, 1491.479999999999, 2.9831359438436857, 16.562453401645687, 12.963823193461328], "isController": false}, {"data": ["随机收藏一个作品", 1704, 14, 0.8215962441314554, 1928.6907276995305, 600, 7537, 1796.0, 2203.5, 2418.0, 4448.600000000002, 2.9872672990650764, 3.2521792292447156, 12.69296876780483], "isController": false}, {"data": ["随机查看一个作品详情页", 1723, 0, 0.0, 1353.461404526988, 818, 4338, 1260.0, 1665.2000000000003, 1843.5999999999997, 2937.5999999999995, 2.9806285095473526, 69.90956529779903, 12.629831155201135], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 18, 78.26086956521739, 0.12932892656990946], "isController": false}, {"data": ["404/Not Found", 5, 21.73913043478261, 0.035924701824974856], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13918, 23, "500/Internal Server Error", 18, "404/Not Found", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["随机点赞一个作品", 1713, 9, "404/Not Found", 5, "500/Internal Server Error", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["随机收藏一个作品", 1704, 14, "500/Internal Server Error", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
