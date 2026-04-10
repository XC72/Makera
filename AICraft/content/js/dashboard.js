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

    var data = {"OkPercent": 99.96907131901357, "KoPercent": 0.030928680986435565};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7255931679174898, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.949105588095615, 500, 1500, "获取文生图资产列表"], "isController": false}, {"data": [0.5958116831994962, 500, 1500, "获取image列表第2页"], "isController": false}, {"data": [0.668345663466079, 500, 1500, "获取3D列表第3页"], "isController": false}, {"data": [0.4981789390340459, 500, 1500, "预览某个浮雕作品"], "isController": false}, {"data": [0.4986637321175916, 500, 1500, "预览作品"], "isController": false}, {"data": [0.5807770961145194, 500, 1500, "获取relief列表第3页"], "isController": false}, {"data": [0.6103752759381899, 500, 1500, "获取image列表第4页"], "isController": false}, {"data": [0.5584487098804279, 500, 1500, "获取3D列表第1页"], "isController": false}, {"data": [0.5360025320462098, 500, 1500, "获取浮雕资产列表"], "isController": false}, {"data": [0.9689078282828283, 500, 1500, "收藏某个relief作品"], "isController": false}, {"data": [0.4989702154626109, 500, 1500, "预览某个3d作品"], "isController": false}, {"data": [0.5642879597610814, 500, 1500, "获取AI Craft首页"], "isController": false}, {"data": [0.9726438962681847, 500, 1500, "打开浮雕生成器"], "isController": false}, {"data": [0.9686859126045118, 500, 1500, "点赞某个relief作品"], "isController": false}, {"data": [0.9733681049470523, 500, 1500, "点赞某个image作品"], "isController": false}, {"data": [0.9715370018975332, 500, 1500, "收藏某个image作品"], "isController": false}, {"data": [0.5661949685534591, 500, 1500, "获取relief列表第2页"], "isController": false}, {"data": [0.5849338790931989, 500, 1500, "获取image列表第1页"], "isController": false}, {"data": [0.5764752163650668, 500, 1500, "获取3D列表第2页"], "isController": false}, {"data": [0.5952080706179067, 500, 1500, "获取image列表第3页"], "isController": false}, {"data": [0.9688881869867341, 500, 1500, "点赞某个3d作品"], "isController": false}, {"data": [0.9727977226000316, 500, 1500, "打开3d生成器"], "isController": false}, {"data": [0.526911508627513, 500, 1500, "获取3d资产列表"], "isController": false}, {"data": [0.9668931731984829, 500, 1500, "收藏某个3d作品"], "isController": false}, {"data": [0.972718646212241, 500, 1500, "打开文生图生成器"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 158429, 49, 0.030928680986435565, 572.0282460913271, 353, 22958, 503.0, 658.0, 717.9500000000007, 1166.0, 86.9669514715529, 539.0623515092578, 360.2640955560763], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["获取文生图资产列表", 6317, 4, 0.06332119677061897, 531.4345417128377, 396, 21967, 445.0, 499.0, 557.0999999999995, 879.4599999999991, 3.493316964458528, 11.729879715901864, 14.390580090146324], "isController": false}, {"data": ["获取image列表第2页", 6351, 2, 0.0314911037631869, 611.6487167375238, 453, 22132, 524.0, 605.0, 673.0, 984.3199999999961, 3.4996671706863336, 12.392701162326478, 14.448663820661482], "isController": false}, {"data": ["获取3D列表第3页", 6353, 0, 0.0, 584.1652762474415, 450, 22152, 512.0, 584.0, 647.2999999999993, 932.46, 3.4979589274761285, 3.7229922963896636, 14.435912526869258], "isController": false}, {"data": ["预览某个浮雕作品", 6315, 1, 0.01583531274742676, 729.3984164687254, 563, 22184, 665.0, 766.0, 836.0, 1120.0400000000009, 3.4938609847210667, 18.436939561046024, 14.433774381990489], "isController": false}, {"data": ["预览作品", 6361, 1, 0.015720798616569723, 714.5620185505448, 563, 22199, 664.0, 764.0, 827.0, 1112.38, 3.496716846193383, 18.36938415699632, 14.445589009336855], "isController": false}, {"data": ["获取relief列表第3页", 6357, 3, 0.04719207173194903, 594.799905615856, 454, 22059, 526.0, 604.0, 673.0, 940.2600000000002, 3.498624105668685, 10.748542949401486, 14.445503835305448], "isController": false}, {"data": ["获取image列表第4页", 6342, 1, 0.01576789656259855, 589.4604225796289, 452, 22208, 520.0, 593.0, 661.6999999999989, 953.5699999999997, 3.4967444768584652, 10.26848425679293, 14.43886784988948], "isController": false}, {"data": ["获取3D列表第1页", 6356, 1, 0.015733165512901194, 615.8112020138443, 454, 22958, 530.0, 613.0, 685.1499999999996, 971.4300000000003, 3.4980795235215028, 15.546187460167793, 14.43413891678137], "isController": false}, {"data": ["获取浮雕资产列表", 6319, 4, 0.06330115524608323, 624.2095268238671, 466, 22321, 547.0, 634.0, 697.0, 1011.2000000000016, 3.4940172074403377, 20.359954958854477, 14.41733736356247], "isController": false}, {"data": ["收藏某个relief作品", 6336, 0, 0.0, 497.9251893939381, 383, 21953, 431.0, 475.0, 513.0, 828.8900000000003, 3.49531530656828, 3.7851445530922727, 14.721967692606437], "isController": false}, {"data": ["预览某个3d作品", 6312, 2, 0.031685678073510776, 724.0337452471489, 565, 22201, 666.0, 770.0, 859.0, 1132.87, 3.537511804315966, 18.900735444788026, 14.597973064092182], "isController": false}, {"data": ["获取AI Craft首页", 6362, 1, 0.01571832756994656, 634.5719899402712, 455, 22182, 529.0, 619.0, 722.8499999999995, 1139.8499999999995, 3.4934756788308663, 16.052138743994732, 14.428788438459753], "isController": false}, {"data": ["打开浮雕生成器", 6324, 1, 0.015812776723592662, 458.7454142947495, 354, 21960, 397.0, 444.0, 497.0, 981.75, 3.4942991095725784, 96.55851271355891, 14.3264080289382], "isController": false}, {"data": ["点赞某个relief作品", 6339, 0, 0.0, 505.3251301467101, 385, 22089, 432.0, 476.0, 511.0, 843.8000000000011, 3.4966500779423657, 3.764357178199526, 14.700272056193247], "isController": false}, {"data": ["点赞某个image作品", 6327, 1, 0.0158052789631737, 476.52441915599843, 387, 21959, 431.0, 474.0, 501.0, 807.0400000000018, 3.4946031661866903, 3.7615735946194047, 14.685932413369521], "isController": false}, {"data": ["收藏某个image作品", 6324, 3, 0.04743833017077799, 475.1053130929794, 386, 21937, 431.0, 473.0, 506.0, 808.0, 3.5361473774971524, 3.830359446284557, 14.883431794963842], "isController": false}, {"data": ["获取relief列表第2页", 6360, 3, 0.04716981132075472, 609.3470125786159, 461, 22020, 528.0, 609.0, 686.9499999999998, 969.510000000003, 3.496788013274599, 13.89446245079893, 14.437925990632898], "isController": false}, {"data": ["获取image列表第1页", 6352, 3, 0.04722921914357683, 585.6963161209051, 458, 22034, 525.0, 604.0, 671.3499999999995, 961.9400000000005, 3.499425668882272, 15.916514253431526, 14.445392253863995], "isController": false}, {"data": ["获取3D列表第2页", 6355, 4, 0.06294256490952006, 592.4033044846541, 460, 22175, 527.0, 606.0, 668.0, 937.6399999999976, 3.4995784536103476, 11.768039185985936, 14.433505694799864], "isController": false}, {"data": ["获取image列表第3页", 6344, 3, 0.04728877679697352, 606.250472887767, 457, 22065, 524.0, 598.0, 665.75, 977.8500000000013, 3.4971144946686095, 11.336712295666311, 14.435843281456805], "isController": false}, {"data": ["点赞某个3d作品", 6332, 1, 0.015792798483891344, 497.55416929879965, 381, 21920, 431.0, 474.0, 514.0, 814.6800000000003, 3.4949942982799906, 3.7657170087123717, 14.677340339938148], "isController": false}, {"data": ["打开3d生成器", 6323, 2, 0.03163055511624229, 460.5114660762302, 353, 21959, 398.0, 442.0, 500.0, 958.0, 3.5369053672245276, 97.72328061118039, 14.484985243607644], "isController": false}, {"data": ["获取3d资产列表", 6317, 5, 0.0791514959632737, 625.9449105588102, 472, 22349, 549.0, 635.0, 704.0999999999995, 1004.2799999999988, 3.5349807526257737, 20.890612527084542, 14.570253895221983], "isController": false}, {"data": ["收藏某个3d作品", 6328, 2, 0.0316055625790139, 484.4533817951951, 385, 21995, 431.0, 479.0, 516.0, 820.1300000000001, 3.4931103807424075, 3.785753100666771, 14.69439005913944], "isController": false}, {"data": ["打开文生图生成器", 6323, 1, 0.015815277558121146, 469.54657599240954, 353, 21934, 397.0, 441.60000000000036, 505.0, 918.8800000000028, 3.494930333541161, 96.57615749098908, 14.3255831712444], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 49, 100.0, 0.030928680986435565], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 158429, 49, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 49, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["获取文生图资产列表", 6317, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["获取image列表第2页", 6351, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["预览某个浮雕作品", 6315, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["预览作品", 6361, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["获取relief列表第3页", 6357, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["获取image列表第4页", 6342, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["获取3D列表第1页", 6356, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["获取浮雕资产列表", 6319, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["预览某个3d作品", 6312, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["获取AI Craft首页", 6362, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["打开浮雕生成器", 6324, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["点赞某个image作品", 6327, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["收藏某个image作品", 6324, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["获取relief列表第2页", 6360, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["获取image列表第1页", 6352, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["获取3D列表第2页", 6355, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["获取image列表第3页", 6344, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["点赞某个3d作品", 6332, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["打开3d生成器", 6323, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["获取3d资产列表", 6317, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["收藏某个3d作品", 6328, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["打开文生图生成器", 6323, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: 由于连接方在一段时间后没有正确答复或连接的主机没有反应，连接尝试失败。", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
