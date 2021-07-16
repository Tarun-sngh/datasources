const Students=require('../models/students');

const pdfMake = require('../pdfmake/pdfmake');
const vfsFonts = require('../pdfmake/vfs_fonts');

pdfMake.vfs = vfsFonts.pdfMake.vfs;

exports.pdfController = async ( req, res )=>{
    try{       
console.log(req.body.studentId);
        Students.find({_id:req.body.studentId},(err, student)=>{
            if(err) throw error

            let resultPdf = null;
            let testIndex = null;

            console.log(student);

            student[0].testCompleted.forEach( async (testMatched, index) => {
                if(testMatched.testCode == req.body.testCode){
                    testIndex = index;
                    resultPdf = testMatched.result.pdf;
                }
            })
            
            if(!resultPdf){ 
                let correctAnswer = student[0].testCompleted[testIndex].result.correctQuestions;
                let totalAnswers = student[0].testCompleted[testIndex].result.totalQuestions;
                let percentage = (correctAnswer/totalAnswers)*100;

                let documentDefinition = {
                    content: [
                        {
                            text: `${student[0].college}\n\n`,
                            style: 'header'
                        },
                        {
                            text: `Subject: ${student[0].testCompleted[testIndex].subjectName}\n\n`,
                            style: 'subheader'
                        },
                        {
                            text:`Student : ${student[0].name}\nTestId: ${student[0].testCompleted[testIndex].testCode}\nTeacher: ${student[0].teacherName}\nDate: ${student[0].testCompleted[testIndex].result.date}\nTotal number of Question: ${student[0].testCompleted[testIndex].result.totalQuestions}\nCorrect answers: ${student[0].testCompleted[testIndex].result.correctQuestions}\nWrong answers: ${totalAnswers - correctAnswer}\nTotal marks: ${student[0].testCompleted[testIndex].result.correctQuestions}\nPercentage: ${percentage}`,
                            style: ['quote', 'small']
                        }
                    ],
                    styles: {
                        header: {
                            fontSize: 19,
                            bold: true
                        },
                        subheader: {
                            fontSize: 15,
                            bold: true
                        },
                        quote: {
                            italics: true
                        },
                        small: {
                            fontSize: 13
                        }
                    }
                }

                const pdfDoc = pdfMake.createPdf(documentDefinition);
                pdfDoc.getBase64( async (data)=>{
                    console.log(data);
                    student[0].testCompleted[testIndex].result.pdf = data;
                    await student[0].save();

                    res.writeHead(200, {
                            'Content-Type': 'application/pdf',
                            'Content-Disposition':'attachment;filename="result.pdf"'
                    });

                    let generatedPdf = Buffer.from(data.toString('utf-8'), 'base64');
            
                    res.end(generatedPdf);

                });
            }else{

                let pdfString = student[0].testCompleted[testIndex].result.pdf;
                console.log(pdfString)
                console.log('saved');
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition':'attachment;filename="result.pdf"'
                });

                let generatedPdf = Buffer.from(pdfString.toString('utf-8'), 'base64');
                res.end(generatedPdf);
            }
        })
    }
    catch(error){
        res.send({result:'error', message : error.message}); //----------------------------------render
    }
}

