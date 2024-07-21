<template>
    <div>
        <h2>Ⅴ. Rewrite the sentences（按要求改写下列句子，每线一词）：【语法-句法】</h2>

        <div v-if="permission === '2'" class="class-select">
            <label for="class-select">选择班级：</label>
            <select id="class-select" v-model="selectedClass" @change="fetchData">
                <option value="11">张江一班</option>
                <option value="12">张江二班</option>
                <option value="13">张江三班</option>
                <option value="21">滨江一班</option>
                <option value="22">滨江二班</option>
                <option value="23">滨江三班</option>
            </select>
        </div>

        <div v-if="permission === '0'" class="class-select">
            <label for="class-select">选择班级：</label>
            <select id="class-select" v-model="selectedClass" @change="fetchData">
                <option v-for="cls in classOptions" :key="cls" :value="cls">{{ getClassDisplayName(cls) }}</option>
            </select>
        </div>


        <div v-for="(question, index) in questions" :key="index">

            <div class="question-container">
                <p
                    :class="{ highlighted: permission === '1' && questionData[question]?.studentAnswer !== questionData[question]?.correctAnswer }">
                    【题目】： {{ index + 1 }}
                </p>
            </div>

            <div>
                <p>【难度】：{{ staticData[question]?.difficulty }}</p>
            </div>


            <div v-if="questionDescriptions[question]">
                <p>【题目描述】：{{ questionDescriptions[question] }}</p>
            </div>


            <!-- 根据 permission 显示不同内容 -->
            <div v-if="permission === '1'" class="peer-accuracy-container">
                <p> 【同伴正确率】：{{ questionData[question]?.peerAccuracy }}%</p>
                <p> 【学生答案】：{{ questionData[question]?.studentAnswer }}</p>
            </div>


            <div v-if="permission === '0' || permission === '2'" class="option-percentages-container">
                <p>【正确人数比】</p>
                <div>
                    <!-- 直接显示 optionPercentages 的值 -->
                    <p>{{ questionData[question]?.optionPercentages || '0' }}</p>
                </div>
            </div>

            <!-- 显示图片和难度 -->
            <div>
                <!-- 显示选项 -->
                <div v-if="permission === '0' || permission === '2'">
                    <p>【选项人数】</p>
                    <div v-for="(count, option) in questionData[question]?.optionCounts" :key="option">
                        <p>{{ option }}: {{ count }} 人</p>
                    </div>
                </div>
            </div>

            <!-- 正确答案 -->
            <div class="corrent_answer">
                <p>【正确答案】</p>
                <p v-html="highlightText(questionData[question]?.correctAnswer, questionData[question]?.correctAnswer)"></p>
            </div>

            <!-- 参考解析 -->
            <div>
                <h3>参考解析</h3>
                <p>{{ referenceAnalysis }}</p>
            </div>

            <hr>
        </div>
    </div>
</template>



<script>
import axios from 'axios';

export default {
    data() {
        return {
            questions: ['PART2_V_1_1', 'PART2_V_1_2', 'PART2_V_2_1', 'PART2_V_2_2', 'PART2_V_3_1', 'PART2_V_3_2', 'PART2_V_4_1', 'PART2_V_4_2', 'PART2_V_5_1', 'PART2_V_5_2'],
            listeningText: '',
            correctAnswer: '',
            studentAnswer: '',
            peerAccuracy: 0,
            permission: this.$route.query.permission,
            name: this.$route.query.name,
            referenceAnalysis: 'Example reference analysis text', // Example reference analysis
            isAnswerCorrect: (question) => this[`studentAnswer_${question}`] === this[`correctAnswer_${question}`],
            options: [
                { text: 'A', value: 'A' },
                { text: 'B', value: 'B' },
                { text: 'C', value: 'C' },
            ],
            questionData: {},
            selectedClass: '11',
            optionCounts: {},
            optionPercentages: {},
            staticData: {
                'PART2_V_1_1': { difficulty: '三颗星' },
                'PART2_V_1_2': { difficulty: '三颗星' },
                'PART2_V_2_1': { difficulty: '三颗星' },
                'PART2_V_2_2': { difficulty: '三颗星' },
                'PART2_V_3_1': { difficulty: '三颗星' },
                'PART2_V_3_2': { difficulty: '三颗星' },
                'PART2_V_4_1': { difficulty: '三颗星' },
                'PART2_V_4_2': { difficulty: '三颗星' },
                'PART2_V_5_1': { difficulty: '三颗星' },
                'PART2_V_5_2': { difficulty: '三颗星' },
            },
            questionDescriptions: {
                'PART2_V_1_1': '1. The coffee is sweet. （改为否定句，意思不变）  The coffee __________  __________.（第一空）',
                'PART2_V_1_2': '1. The coffee is sweet. （改为否定句，意思不变）  The coffee __________  __________.（第二空）',
                'PART2_V_2_1': '2. We ride a bicycle in the park. （改为一般疑问句）  __________  __________ ride a bicycle in the park? （第一空）',
                'PART2_V_2_2': '2. We ride a bicycle in the park. （改为一般疑问句）  __________  __________ ride a bicycle in the park? （第二空）',
                'PART2_V_3_1': '3. I have two arms. They are long. （合并成一句）  My __________ are __________. （第一空）',
                'PART2_V_3_2': '3. I have two arms. They are long. （合并成一句）  My __________ are __________. （第二空）',
                'PART2_V_4_1': '4. It is summer now.	 （对划线部分提问）  __________  ________is it now? (第一空)',
                'PART2_V_4_2': '4. It is summer now.	 （对划线部分提问）  __________  ________is it now? (第二空)',
                'PART2_V_5_1': '5. Are your hats blue?（改成肯定句）My _______ ________ blue. (第一空)',
                'PART2_V_5_2': '5. Are your hats blue?（改成肯定句）My _______ ________ blue. (第二空)'
            },
            classOptions: []
        };
    },
    methods: {
        async fetchClassOptions() {
            if (this.permission === '0') {
                console.log("permission===0能进来吗");
                try {
                    console.log(this.name);
                    const response = await axios.get('http://localhost:3000/api/teacher-classes', {
                        params: { name: this.name }
                    });
                    this.classOptions = response.data.classes;
                    this.selectedClass = this.classOptions[0];
                    console.log(this.selectedClass);
                    this.fetchData();
                } catch (error) {
                    console.error('Error fetching class options:', error);
                }
            } else {
                this.fetchData();
            }
        },

        async fetchData() {
            try {
                const questions = this.questions;
                const questionData = {};

                for (const question of questions) {
                    console.log(question);
                    const response = await axios.get('http://localhost:3000/api/question_single', {
                        params: { question }
                    });

                    const { correctAnswer, listeningText } = response.data;
                    console.log(listeningText);
                    console.log(question);
                    console.log(correctAnswer);
                    console.log("per", this.permission);
                    if (this.permission === '1') {
                        // 获取学生答案和同伴正确率
                        console.log("hi");
                        const studentResponse = await axios.get('http://localhost:3000/api/student-answer', {
                            params: { name: this.name, question }
                        });
                        const studentAnswer = studentResponse.data.answer;
                        console.log("stu_ans:", studentAnswer);

                        const peerResponse = await axios.get('http://localhost:3000/api/peer-accuracy', {
                            params: { name: this.name, question }
                        });
                        console.log(peerResponse);
                        const peerAccuracy = peerResponse.data.accuracy * 100;
                        questionData[question] = {
                            correctAnswer,
                            listeningText,
                            studentAnswer,
                            peerAccuracy
                        };
                        console.log(questionData);
                    } else if (this.permission === '2') {
                        // 获取选项人数比
                        const optionResponse = await axios.get('http://localhost:3000/api/option-percentages', {
                            params: { question, class: this.selectedClass }
                        });
                        console.log(optionResponse);
                        const optionPercentages = optionResponse.data.optionPercentages;
                        console.log(optionPercentages);

                        const optionCountsResponse = await axios.get('http://localhost:3000/api/option-counts', {
                            params: { question, class: this.selectedClass }
                        });
                        const optionCounts = optionCountsResponse.data.optionCounts;

                        questionData[question] = {
                            correctAnswer,
                            listeningText,
                            optionPercentages,
                            optionCounts
                        };

                        this.optionCounts = optionCounts;
                        console.log.optionCounts;
                    } else if (this.permission === '0') {
                        // 获取选项人数比
                        const optionResponse = await axios.get('http://localhost:3000/api/option-percentages', {
                            params: { question, class: this.selectedClass }
                        });
                        console.log(optionResponse);
                        const optionPercentages = optionResponse.data.optionPercentages;
                        console.log(optionPercentages);

                        const optionCountsResponse = await axios.get('http://localhost:3000/api/option-counts', {
                            params: { question, class: this.selectedClass }
                        });
                        const optionCounts = optionCountsResponse.data.optionCounts;

                        questionData[question] = {
                            correctAnswer,
                            listeningText,
                            optionPercentages,
                            optionCounts
                        };

                        this.optionCounts = optionCounts;
                        console.log.optionCounts;
                    }
                }
                this.questionData = questionData;
                console.log(questionData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },

        highlightText(text, highlightText) {
            if (!text || !highlightText) return text;

            return Array.from(text).map(char => {
                if (highlightText.includes(char)) {
                    return `<span class="highlighted">${char}</span>`;
                }
                return char;
            }).join('');
        },

        getClassDisplayName(classCode) {
            const classMap = {
                '11': '张江一班',
                '12': '张江二班',
                '13': '张江三班',
                '21': '滨江一班',
                '22': '滨江二班',
                '23': '滨江三班'
            };
            return classMap[classCode] || classCode;
        }
    },

    created() {
        this.fetchClassOptions();
    }
};
</script>

<style>
.highlighted {
    background-color: yellow;
}

.highlight {
    color: red;
}

.class-select {
    margin-bottom: 20px;
}
</style>