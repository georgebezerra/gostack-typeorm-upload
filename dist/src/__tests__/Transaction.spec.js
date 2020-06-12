"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var path_1 = __importDefault(require("path"));
var typeorm_1 = require("typeorm");
var database_1 = __importDefault(require("../database"));
var Transaction_1 = __importDefault(require("../models/Transaction"));
var Category_1 = __importDefault(require("../models/Category"));
var app_1 = __importDefault(require("../app"));
var connection;
describe('Transaction', function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.default('test-connection')];
                case 1:
                    connection = _a.sent();
                    return [4 /*yield*/, connection.query('DROP TABLE IF EXISTS transactions')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, connection.query('DROP TABLE IF EXISTS categories')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, connection.query('DROP TABLE IF EXISTS migrations')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, connection.runMigrations()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.query('DELETE FROM transactions')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, connection.query('DELETE FROM categories')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mainConnection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mainConnection = typeorm_1.getConnection();
                    return [4 /*yield*/, connection.close()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, mainConnection.close()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be able to list transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(app_1.default).post('/transactions').send({
                        title: 'March Salary',
                        type: 'income',
                        value: 4000,
                        category: 'Salary',
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, supertest_1.default(app_1.default).post('/transactions').send({
                            title: 'April Salary',
                            type: 'income',
                            value: 4000,
                            category: 'Salary',
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, supertest_1.default(app_1.default).post('/transactions').send({
                            title: 'Macbook',
                            type: 'outcome',
                            value: 6000,
                            category: 'Eletronics',
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, supertest_1.default(app_1.default).get('/transactions')];
                case 4:
                    response = _a.sent();
                    expect(response.body.transactions).toHaveLength(3);
                    expect(response.body.balance).toMatchObject({
                        income: 8000,
                        outcome: 6000,
                        total: 2000,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be able to create new transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transactionsRepository, response, transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transactionsRepository = typeorm_1.getRepository(Transaction_1.default);
                    return [4 /*yield*/, supertest_1.default(app_1.default).post('/transactions').send({
                            title: 'March Salary',
                            type: 'income',
                            value: 4000,
                            category: 'Salary',
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, transactionsRepository.findOne({
                            where: {
                                title: 'March Salary',
                            },
                        })];
                case 2:
                    transaction = _a.sent();
                    expect(transaction).toBeTruthy();
                    expect(response.body).toMatchObject(expect.objectContaining({
                        id: expect.any(String),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should create tags when inserting new transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transactionsRepository, categoriesRepository, response, category, transaction;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    transactionsRepository = typeorm_1.getRepository(Transaction_1.default);
                    categoriesRepository = typeorm_1.getRepository(Category_1.default);
                    return [4 /*yield*/, supertest_1.default(app_1.default).post('/transactions').send({
                            title: 'March Salary',
                            type: 'income',
                            value: 4000,
                            category: 'Salary',
                        })];
                case 1:
                    response = _b.sent();
                    return [4 /*yield*/, categoriesRepository.findOne({
                            where: {
                                title: 'Salary',
                            },
                        })];
                case 2:
                    category = _b.sent();
                    expect(category).toBeTruthy();
                    return [4 /*yield*/, transactionsRepository.findOne({
                            where: {
                                title: 'March Salary',
                                category_id: (_a = category) === null || _a === void 0 ? void 0 : _a.id,
                            },
                        })];
                case 3:
                    transaction = _b.sent();
                    expect(transaction).toBeTruthy();
                    expect(response.body).toMatchObject(expect.objectContaining({
                        id: expect.any(String),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not create tags when they already exists', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transactionsRepository, categoriesRepository, identifiers, insertedCategoryId, transaction, categoriesCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transactionsRepository = typeorm_1.getRepository(Transaction_1.default);
                    categoriesRepository = typeorm_1.getRepository(Category_1.default);
                    return [4 /*yield*/, categoriesRepository.insert({
                            title: 'Salary',
                        })];
                case 1:
                    identifiers = (_a.sent()).identifiers;
                    insertedCategoryId = identifiers[0].id;
                    return [4 /*yield*/, supertest_1.default(app_1.default).post('/transactions').send({
                            title: 'March Salary',
                            type: 'income',
                            value: 4000,
                            category: 'Salary',
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, transactionsRepository.findOne({
                            where: {
                                title: 'March Salary',
                                category_id: insertedCategoryId,
                            },
                        })];
                case 3:
                    transaction = _a.sent();
                    return [4 /*yield*/, categoriesRepository.find()];
                case 4:
                    categoriesCount = _a.sent();
                    expect(categoriesCount).toHaveLength(1);
                    expect(transaction).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not be able to create outcome transaction without a valid balance', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(app_1.default).post('/transactions').send({
                        title: 'March Salary',
                        type: 'income',
                        value: 4000,
                        category: 'Salary',
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, supertest_1.default(app_1.default).post('/transactions').send({
                            title: 'iPhone',
                            type: 'outcome',
                            value: 4500,
                            category: 'Eletronics',
                        })];
                case 2:
                    response = _a.sent();
                    expect(response.status).toBe(400);
                    expect(response.body).toMatchObject(expect.objectContaining({
                        status: 'error',
                        message: expect.any(String),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be able to delete a transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transactionsRepository, response, transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transactionsRepository = typeorm_1.getRepository(Transaction_1.default);
                    return [4 /*yield*/, supertest_1.default(app_1.default).post('/transactions').send({
                            title: 'March Salary',
                            type: 'income',
                            value: 4000,
                            category: 'Salary',
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, supertest_1.default(app_1.default).delete("/transactions/" + response.body.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, transactionsRepository.findOne(response.body.id)];
                case 3:
                    transaction = _a.sent();
                    expect(transaction).toBeFalsy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be able to import transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transactionsRepository, categoriesRepository, importCSV, transactions, categories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transactionsRepository = typeorm_1.getRepository(Transaction_1.default);
                    categoriesRepository = typeorm_1.getRepository(Category_1.default);
                    importCSV = path_1.default.resolve(__dirname, 'import_template.csv');
                    return [4 /*yield*/, supertest_1.default(app_1.default).post('/transactions/import').attach('file', importCSV)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, transactionsRepository.find()];
                case 2:
                    transactions = _a.sent();
                    return [4 /*yield*/, categoriesRepository.find()];
                case 3:
                    categories = _a.sent();
                    expect(categories).toHaveLength(2);
                    expect(categories).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            title: 'Others',
                        }),
                        expect.objectContaining({
                            title: 'Food',
                        }),
                    ]));
                    expect(transactions).toHaveLength(3);
                    expect(transactions).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            title: 'Loan',
                            type: 'income',
                        }),
                        expect.objectContaining({
                            title: 'Website Hosting',
                            type: 'outcome',
                        }),
                        expect.objectContaining({
                            title: 'Ice cream',
                            type: 'outcome',
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
});
