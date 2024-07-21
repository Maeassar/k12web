<template>
  <div class="container">
    <h1>欢迎, {{ name }}!</h1>
    <p>你的身份是: {{ permissionLabel }}</p>

    <div v-if="permission === 0">
      <button @click="fetchTeacherClasses">获取班级</button>
      <select v-if="classes.length" v-model="selectedClass" @change="fetchData">
        <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
      </select>
    </div>

    <div v-if="permission === 2">
        <label for="classSelection">选择班级:</label>
        <select v-model="selectedClass" @change="fetchData">
          <option value="1_1">张江一班</option>
          <option value="1_2">张江二班</option>
          <option value="1_3">张江三班</option>
          <option value="2_1">滨江一班</option>
          <option value="2_2">滨江二班</option>
          <option value="2_3">滨江三班</option>
        </select>
      </div>


    <div class="images">
      <img src="@/assets/title.png" alt="Image 0" />
    </div>

    <div id="score-summary" class="chart-container"></div>
    <div id="score-distribution" class="chart-container"></div>
    <div id="score-total" class="chart-container"></div>

    

    <div class="images">
      <img src="@/assets/PART1_1.png" alt="Image 1" @click="goToPage('Part1_1')" />
      <img src="@/assets/PART1_2.png" alt="Image 2" @click="goToPage('Part1_2')" />
      <img src="@/assets/PART1_3.png" alt="Image 3" @click="goToPage('Part1_3')" />
      <img src="@/assets/PART1_4.png" alt="Image 4" @click="goToPage('Part1_4')" />
      <img src="@/assets/PART1_5.png" alt="Image 5" @click="goToPage('Part1_5')" />
      <img src="@/assets/PART1_6.png" alt="Image 6" @click="goToPage('Part1_6')" />
      <img src="@/assets/PART1_7.png" alt="Image 7" @click="goToPage('Part1_7')" />
      <img src="@/assets/PART1_8.png" alt="Image 8" @click="goToPage('Part1_8')" />
      <img src="@/assets/PART2_1.png" alt="Image 9" @click="goToPage('Part2_1')" />
      <img src="@/assets/PART2_1_1.png" alt="Image 10" @click="goToPage('Part2_2')" />
      <img src="@/assets/PART2_1_2.png" alt="Image 11" @click="goToPage('Part2_2')" />
      <img src="@/assets/PART2_3.png" alt="Image 12" @click="goToPage('Part2_3')" />
      <img src="@/assets/PART2_4.png" alt="Image 13" @click="goToPage('Part2_4')" />
      <img src="@/assets/PART2_5.png" alt="Image 14" @click="goToPage('Part2_5')" />
      <img src="@/assets/PART2_6.png" alt="Image 15" @click="goToPage('Part2_6')" />
      <img src="@/assets/PART2_7.png" alt="Image 16" @click="goToPage('Part2_7')" />
      <img src="@/assets/PART2_8.png" alt="Image 17" @click="goToPage('Part2_8')" />
      <img src="@/assets/PART2_9.png" alt="Image 18" @click="goToPage('Part2_9')" />
    </div>


  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'HomePage',
  props: {
    name: {
      type: String,
      required: true
    },
    permission: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      analysisType: '0',// Default to "全校分析"
      selectedClass: '1_1',//Default to “张江一般”
      scoreDistributionData: [],
      scoreDistributionTotal: [],
      classes: []
    };
  },
  computed: {
    permissionLabel() {
      switch (this.permission) {
        case 0:
          return '老师';
        case 1:
          return '学生';
        case 2:
          return '管理员';
        default:
          return '未知';
      }
    }
  },
  methods: {
    async fetchTeacherClasses() {
      try {
        const response = await axios.get('http://localhost:3000/api/teacher-classes', {
          params: { name: this.name }
        });

        this.classes = response.data.classes;
        console.log("班级", this.classes);
      } catch (error) {
        console.error('Error fetching teacher classes:', error);
      }
    },

    goToPage(page) {
      this.$router.push({
        name: page,
        query: {
          name: this.name,
          permission: this.permission
        }
      });
    },
    formatClass(selectedClass) {
      if (selectedClass && selectedClass.length === 2) {
        return `${selectedClass[0]}_${selectedClass[1]}`;
      }
      return selectedClass; // 如果格式不对，返回原始值
    },
    fetchData() {
      let url;
      let url_score;

      if (this.permission === 0) {
        const formattedClass = this.formatClass(this.selectedClass);
        url = `http://localhost:3000/api/admin-score-summary?name=${this.name}&class=${formattedClass}`;
      } else if (this.permission === 1) {
        url = `http://localhost:3000/api/student-score-summary?name=${this.name}&permission=${this.permission}`;
      } else if (this.permission === 2) {
        url = `http://localhost:3000/api/admin-score-summary?name=${this.name}&permission=${this.permission}&class=${this.selectedClass}`;
      }

      console.log(this.name);

      if (this.permission === 1) {
        url_score = `http://localhost:3000/api/student-scores?name=${this.name}`;
      } else if (this.permission === 2) {
        url_score = `http://localhost:3000/api/admin-scores?name=${this.name}&class=${this.selectedClass}`;
      } else if (this.permission == 0) {
        const formattedClass = this.formatClass(this.selectedClass);
        url_score = `http://localhost:3000/api/admin-scores?name=${this.name}&class=${formattedClass}`;
      }
      
      console.log('Fetching data from URL:', url);

      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log('Score Summary Data:', data);
          this.renderScoreSummary(data);
        })
        .catch(error => console.error('Fetching score summary failed:', error));

      fetch(url_score)
        .then(response => response.json())
        .then(data => {
          console.log("Total Score Data:", data);
          if (data && data.averages) {
            this.scoreDistributionData = Object.keys(data.averages).map(key => ({
              question: key,
              avg_score: data.averages[key],
            }));
          } else {
            this.scoreDistributionData = [];
          }

          console.log("赋值之后", this.scoreDistributionData);
          this.renderScoreDistribution();
        });

        fetch(url_score)
        .then(response => response.json())
        .then(data => {
          console.log("Total Score Data:", data);
          if (data && data.totals) {
            this.scoreDistributionTotal = Object.keys(data.totals).map(key => ({
              question: key,
              total: data.totals[key],
            }));
          } else {
            this.scoreDistributionTotal = [];
          }

          console.log("赋值之后大题情况", this.scoreDistributionTotal);
          this.renderScoreTotal();
        });
    },

    renderScoreSummary(data) {
      var mainContainer = document.getElementById('score-summary');
      var resizeMainContainer = function () {
        mainContainer.style.width = window.innerWidth + 'px';
        mainContainer.style.height = window.innerHeight * 0.8 + 'px';
      };
      resizeMainContainer();
      var myChart = echarts.init(mainContainer);
      window.addEventListener('resize', function () {
        resizeMainContainer();
        myChart.resize();
      });
      var option = {
        title: {
          text: '考情分析'
        },
        tooltip: {},
        legend: {
          data: ['最高分', '最低分', '均分', '中位数', '下四分位数', '上四分位数']
        },
        xAxis: {
          type: 'category',
          data: ['最高分', '最低分', '均分', '中位数', '下四分位数', '上四分位数']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '统计数据',
          type: 'bar',
          data: [
            { value: data.max_score, itemStyle: { color: '#FF5733' } },  // 最高分
            { value: data.min_score, itemStyle: { color: '#33FF57' } },  // 最低分
            { value: data.avg_score, itemStyle: { color: '#3357FF' } },  // 均分
            { value: data.median_score, itemStyle: { color: '#FF33A5' } },  // 中位数
            { value: data.q1_score, itemStyle: { color: '#FFBF33' } },  // 下四分位数
            { value: data.q3_score, itemStyle: { color: '#33FFD4' } }   // 上四分位数
          ]
        }]
      };
      myChart.setOption(option);
    },

    renderScoreDistribution() {
      var mainContainer = document.getElementById('score-distribution');
      var resizeMainContainer = function () {
        mainContainer.style.width = window.innerWidth + 'px';
        mainContainer.style.height = window.innerHeight * 0.8 + 'px';
      };
      resizeMainContainer();
      var myChart = echarts.init(mainContainer);
      window.addEventListener('resize', function () {
        resizeMainContainer();
        myChart.resize();
      });

      console.log("所获得的数据为", this.scoreDistributionData);

      if (!this.scoreDistributionData || this.scoreDistributionData.length === 0) {
        myChart.setOption({
          title: {
            text: '各题得分表',
            subtext: '无数据可显示'
          }
        });
        return;
      }
      var option = {
        title: {
          text: '各题得分表'
        },
        tooltip: {},
        legend: {
          data: ['得分率']
        },
        xAxis: {
          type: 'category',
          data: this.scoreDistributionData.map(item => item.question || '未知') // 添加默认值
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '得分率',
          type: 'bar',
          data: this.scoreDistributionData.map(item => item.avg_score || 0) // 添加默认值
        }]
      };
      myChart.setOption(option);
    },

    renderScoreTotal() {
      var mainContainer = document.getElementById('score-total');
      var resizeMainContainer = function () {
        mainContainer.style.width = window.innerWidth + 'px';
        mainContainer.style.height = window.innerHeight * 0.8 + 'px';
      };
      resizeMainContainer();
      var myChart = echarts.init(mainContainer);
      window.addEventListener('resize', function () {
        resizeMainContainer();
        myChart.resize();
      });

      console.log("所获得的数据为", this.scoreDistributionTotal);

      if (!this.scoreDistributionTotal || this.scoreDistributionTotal.length === 0) {
        myChart.setOption({
          title: {
            text: '各题得分表',
            subtext: '无数据可显示'
          }
        });
        return;
      }
      var option = {
        title: {
          text: '各题得分表'
        },
        tooltip: {},
        legend: {
          data: ['得分率']
        },
        xAxis: {
          type: 'category',
          data: this.scoreDistributionTotal.map(item => item.question || '未知') // 添加默认值
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '得分率',
          type: 'bar',
          data: this.scoreDistributionTotal.map(item => item.total || 0) // 添加默认值
        }]
      };
      myChart.setOption(option);
    },

  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  /* Ensure content is aligned at the top */
  height: 100vh;
  margin: 0;
  padding: 20px;
  /* Add padding to prevent overflow */
  box-sizing: border-box;
  /* Include padding and border in element's total width and height */
}

h1,
p {
  text-align: center;
  margin: 10px 0;
  /* Add margin to separate text from other elements */
}

.images {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
  /* Add space between images and charts */
}

.images img {
  flex: 1 0 21%;
  max-width: 80%;
  max-height: 80%;
  object-fit: cover;
  cursor: pointer;
  margin: 8px;
}

.chart-container {
  width: 100%;
  height: 300px;
  /* Adjust height as needed */
  margin: 20px 0;
  /* Add margin to separate charts */
}
</style>