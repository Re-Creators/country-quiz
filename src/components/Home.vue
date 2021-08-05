<template>
    <div v-if="currentQuestion">
        <transition name="switch" mode="out-in">
            <!-- Question container -->
            <div v-if="!isOver" class="relative mx-auto w-full p-5 md:w-1/2 lg:p-0 lg:w-2/6 top-10 lg:top-24">
                <!-- Question Header -->
                <div class="flex flex-row justify-between text-white text-2xl font-bold w-3/5">
                    <h1 class="">COUNTRY QUIZ</h1>
                    <p>{{ numQuestion + 1 }}/{{ totalQuestions }}</p>
                </div>
                <img src="@/assets/images/adventure.svg" alt="adventure" class="absolute right-0 top-0">
                <!-- Question Box -->
                <div class="w-full bg-white rounded-xl px-5 py-20 mt-5 text-lg text-blue-800">
                    <img :src="currentQuestion.flag" alt="" class="w-1/5" v-if="currentQuestion.type == 2">
                    <h1 class="text-2xl font-bold ">{{ currentQuestion.question }}</h1>
                    <!-- Question Choice -->
                    <ul class="mt-5">
                        <li class="mb-3 p-3 bg-white rounded-lg border-2" v-for="(item, index) in currentQuestion.choices" :key="index" :class="[isAnswer ? '' : userAnswerClass ,getAnswerClass(index)]" @click="selectAnswer(index)">
                            <div class="flex flex-row">
                                <p class="font-bold font-lg mr-5">{{ choicesLetter[index] }}</p>
                                <p class="flex-grow">{{ item }}</p>
                                <div class="self-center border-2 border-white text-white rounded-full mx-2" v-if="isAnswer">
                                    <CheckIcon class="w-4 h-4" v-if="index === correctAnswer"/>
                                    <XIcon class="w-4 h-4" v-if="index !== correctAnswer && userAnswer == index"/>
                                </div>
                            </div>
                        </li>
            
                    </ul>
                </div>
                <!-- Next button -->
                <button class="absolute bottom-10 lg:bottom-5 right-10 py-3 px-8 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500 active:bg-yellow-600" v-if="isAnswer" @click="nextQuestion">
                    Next
                </button>
            </div>
            <!-- Result Container -->
            <div v-else class="relative mx-auto w-full md:w-1/2 lg:w-2/6 top-10 lg:top-24 p-5 lg:p-0">
                <h1 class="text-white text-2xl font-bold">COUNTRY QUIZ</h1>
                <div class="w-full bg-white rounded-xl px-5 py-10 mt-5 text-lg flex flex-col items-center justify-between">
                    <img src="@/assets/images/winner.svg" alt="">
                    <div class="p-10 text-center mt-5">
                        <h1 class="font-bold text-4xl">Results</h1>
                        <h1>You got <span class="font-bold text-3xl text-green-400">{{ totalCorrectAnswer }}</span> correct answers</h1>
                    </div>
                    <button class="border-2 border-blue-800 text-blue-800 rounded-lg px-10 py-2 mt-16 hover:text-white hover:border-green-400 hover:bg-green-400" @click="tryAgain">Try again</button>
                </div>
            </div>
        </transition>
        
    </div>
</template>
<script>
import axios from 'axios'
import {CheckIcon, XIcon} from '@heroicons/vue/solid'

export default {
    components : {
        CheckIcon,
        XIcon,
    },
    data() {
        return {
            correctAnswer : null,
            totalQuestions : 10,
            userAnswer : null,
            userAnswerClass : "cursor-pointer hover:bg-yellow-400 hover:border-yellow-400 hover:text-white active:bg-yellow-500 active:border-yellow-500",
            isAnswer: false,
            isOver : false,
            currentQuestion : null,
            numQuestion: 0,
            totalCorrectAnswer : 0,
            countries: [],
            questions : [],
            choicesLetter : ["A", "B", "C", "D"],

        }
    },
    mounted() {
        axios.get('https://restcountries.eu/rest/v2/all?fields=name;capital;currencies;flag')
            .then((response) => {
                this.countries = response.data
            })
            .catch((err) => {
                console.log(err)
            })
    },
    watch : {
        countries() {
            this.generateQuestions()
        },
        numQuestion() {
            
            if(this.numQuestion > this.totalQuestions - 1) {
                this.isOver = true
            }else {
                this.currentQuestion = this.questions[this.numQuestion]
            }
            
        }
    },
    methods: {
        getAnswerClass(index) {
            if(this.userAnswer !== null) {
                if(index == this.correctAnswer) return "bg-green-500 text-white border-green-500"
                if(index == this.userAnswer) return "bg-red-500 text-white border-red-500"
            }
            return "border-blue-800"
        },
        selectAnswer(answerIndex) {
            // prevent from clicking choice when has answered question
            if(this.userAnswer !== null) return
            
            this.correctAnswer = this.currentQuestion.choices.indexOf(this.currentQuestion.answer)
            this.userAnswer = answerIndex
            this.isAnswer = true
            
            // Count correct answer
            if(answerIndex === this.correctAnswer) {
                this.totalCorrectAnswer++
            }
        },
        generateQuestions() {
            //Get random country from countries
            for (let index = 0; index < this.totalQuestions; index++) {
                let randomIndex = Math.floor(Math.random() * this.countries.length)
                let question = this.countries[randomIndex]
                
                //Get random choices from country name
                let randomChoices = []
                for (let index = 0; index < 3; index++) {
                    let index = Math.floor(Math.random() * this.countries.length)
                    randomChoices.push(this.countries[index].name)
                }

                let type = (Math.random() > 0.5 ) ? 1 : 2
                
                //merge random choices and answer then shuffle the array
                let mergedChoices = [...randomChoices, question.name]
                let shuffledChoices = mergedChoices.sort(() => Math.random() - 0.5)

                let newQuestion = {
                    type : type,
                    question : this.generateTypeQuestion(type, question.capital),
                    answer : question.name,
                    choices : shuffledChoices,
                    flag : question.flag
                }

                this.questions.push(newQuestion)
            }
            this.currentQuestion = this.questions[this.numQuestion]
        },
        generateTypeQuestion(type, capital) {
            // Generate random type of question
            if (type == 1) return capital + "is the capital of ?"
            return "Which country does this flag belong to?"
        },
        nextQuestion(){
            this.numQuestion++
            this.reset()
        },
        tryAgain() {
            this.isOver = false
            this.questions = []
            this.numQuestion = 0
            this.reset()
            this.totalCorrectAnswer = 0
            this.generateQuestions()
        },
        reset() {
            this.userAnswer = null
            this.isAnswer = false
            this.correctAnswer = null
            
        }
    },

}
</script>
<style scoped>
@layer utilities {
    .switch-enter-active,
    .switch-leave-active {
        transition: all .3s ease;
    }

    .switch-enter-from,
    .switch-leave-to {
        opacity: 0;
        transform:scale(0.5)
    }
}
</style>