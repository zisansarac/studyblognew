const {Router} = require('express')

const {createStudyPlan, getStudyPlan, getStudyPlans,getCatPlans,getUserPlans, editStudyPlan, deleteStudyPlan} = require('../controllers/postControllers')
const authMiddleware = require('../middleware/authMiddleware');

const router = Router()

router.post('/', authMiddleware, createStudyPlan);
router.get('/', getStudyPlans);
router.get('/:id', getStudyPlan);
router.patch('/:id', authMiddleware, editStudyPlan);
router.get('/categories/:category', getCatPlans);
router.get('/users/:id', getUserPlans);
router.delete('/:id',authMiddleware, deleteStudyPlan);





module.exports = router