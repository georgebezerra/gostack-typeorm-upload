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
var typeorm_1 = require("typeorm");
var AppError_1 = __importDefault(require("../errors/AppError"));
var Category_1 = __importDefault(require("../models/Category"));
var TransactionsRepository_1 = __importDefault(require("../repositories/TransactionsRepository"));
var CreateTransactionService = /** @class */ (function () {
    function CreateTransactionService() {
    }
    CreateTransactionService.prototype.execute = function (_a) {
        var title = _a.title, value = _a.value, type = _a.type, category = _a.category;
        return __awaiter(this, void 0, void 0, function () {
            var categoryRepository, transactionsRepository, total, transactionCategory, transaction;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        categoryRepository = typeorm_1.getRepository(Category_1.default);
                        transactionsRepository = typeorm_1.getCustomRepository(TransactionsRepository_1.default);
                        return [4 /*yield*/, transactionsRepository.getBalance()];
                    case 1:
                        total = (_b.sent()).total;
                        if (type === 'outcome' && total < value) {
                            throw new AppError_1.default('You do not have enought balance');
                        }
                        return [4 /*yield*/, categoryRepository.findOne({
                                where: {
                                    title: category,
                                },
                            })
                            //Reescrendo o let, se a categoria não existe, crio. Com "const" não seria possível.
                            //Estou sobrescrevendo, verificando com o ID da categoria que será retornado com o findOne
                            //Se a category existe ou não. Existe? Buscar no DB e usar o ID que foi retornado
                        ];
                    case 2:
                        transactionCategory = _b.sent();
                        if (!!transactionCategory) return [3 /*break*/, 4];
                        transactionCategory = categoryRepository.create({
                            title: category,
                        });
                        return [4 /*yield*/, categoryRepository.save(transactionCategory)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        transaction = transactionsRepository.create({
                            title: title,
                            value: value,
                            type: type,
                            category: transactionCategory,
                        });
                        return [4 /*yield*/, transactionsRepository.save(transaction)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, transaction];
                }
            });
        });
    };
    return CreateTransactionService;
}());
exports.default = CreateTransactionService;
