/**
 * Created by jamesbray on 4/17/17.
 */



angular.module('quizList', [])
    .controller('QuizListController', function() {
        var quizList = this;
        quizList.quizzes = [
            {text:'Default Quiz', done:true}];

        quizList.addQuiz = function() {
            quizList.quizzes.push({text:quizList.quizText, done:false});
            quizList.quizText = '';
        };

        quizList.remaining = function() {
            var count = 0;
            angular.forEach(quizList.quizzes, function(quiz) {
                count += quiz.done ? 0 : 1;
            });
            return count;
        };

        quizList.archive = function() {
            var oldQuizzes = quizList.quizzes;
            quizList.quizzes = [];
            angular.forEach(oldQuizzes, function(todo) {
                if (!quiz.done) quizList.quizzes.push(todo);
            });
        };
    });

