import React, { useState } from 'react';
import {
  Building2,
  Calculator,
  Plus,
  Trash2,
  Users,
  Droplets,
  Zap,
  Shield,
  Wrench,
  Trees,
  Hammer,
  FileText,
  Wallet,
  IndianRupee,
  Home,
  Sparkles,
  FileDown,
  type LucideIcon,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SocietyData {
  societyName: string;
  totalFlats: string;
}

interface FlatType {
  id: number;
  name: string;
  count: string;
  sqft: string;
}

interface Expense {
  id: number;
  name: string;
  amount: string;
  icon: LucideIcon;
}

interface MaintenanceResult {
  [key: number]: {
    name: string;
    sqft: string;
    maintenance: number;
    count: number;
  };
  perSqFt?: string;
}

const MaintenanceCalculator: React.FC = () => {
  const [societyData, setSocietyData] = useState<SocietyData>({
    societyName: '',
    totalFlats: '',
  });

  const [flatTypes, setFlatTypes] = useState<FlatType[]>([
    { id: 1, name: '1 BHK', count: '', sqft: '600' },
    { id: 2, name: '2 BHK', count: '', sqft: '900' },
    { id: 3, name: '3 BHK', count: '', sqft: '1200' },
  ]);

  const [newFlatType, setNewFlatType] = useState<{
    name: string;
    sqft: string;
  }>({
    name: '',
    sqft: '',
  });

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, name: 'Staff Salaries', amount: '', icon: Users },
    { id: 2, name: 'Water Charges', amount: '', icon: Droplets },
    { id: 3, name: 'Electricity (Common Areas)', amount: '', icon: Zap },
    { id: 4, name: 'Security Services', amount: '', icon: Shield },
    { id: 5, name: 'Lift Maintenance', amount: '', icon: Wrench },
    { id: 6, name: 'Garden Maintenance', amount: '', icon: Trees },
    { id: 7, name: 'Cleaning Supplies', amount: '', icon: Sparkles },
    { id: 8, name: 'Repair & Maintenance', amount: '', icon: Hammer },
    { id: 9, name: 'Insurance Premium', amount: '', icon: FileText },
    { id: 10, name: 'Sinking Fund', amount: '', icon: Wallet },
  ]);

  const [newExpenseName, setNewExpenseName] = useState<string>('');

  const calculateTotalExpense = (): number => {
    return expenses.reduce(
      (sum, expense) => sum + (parseFloat(expense.amount) || 0),
      0
    );
  };

  const addExpense = (): void => {
    if (newExpenseName.trim()) {
      setExpenses([
        ...expenses,
        {
          id: Date.now(),
          name: newExpenseName,
          amount: '',
          icon: IndianRupee,
        },
      ]);
      setNewExpenseName('');
    }
  };

  const updateExpenseAmount = (id: number, value: string): void => {
    setExpenses(
      expenses.map((exp) => (exp.id === id ? { ...exp, amount: value } : exp))
    );
  };

  const deleteExpense = (id: number): void => {
    if (expenses.length > 5) {
      setExpenses(expenses.filter((exp) => exp.id !== id));
    }
  };

  const addFlatType = (): void => {
    if (newFlatType.name.trim() && newFlatType.sqft) {
      setFlatTypes([
        ...flatTypes,
        {
          id: Date.now(),
          name: newFlatType.name,
          count: '',
          sqft: newFlatType.sqft,
        },
      ]);
      setNewFlatType({ name: '', sqft: '' });
    }
  };

  const updateFlatType = (
    id: number,
    field: keyof Omit<FlatType, 'id'>,
    value: string
  ): void => {
    setFlatTypes(
      flatTypes.map((flat) =>
        flat.id === id ? { ...flat, [field]: value } : flat
      )
    );
  };

  const deleteFlatType = (id: number): void => {
    if (flatTypes.length > 1) {
      setFlatTypes(flatTypes.filter((flat) => flat.id !== id));
    }
  };

  const calculatePerFlatMaintenance = (): MaintenanceResult => {
    const total = calculateTotalExpense();
    const totalArea = flatTypes.reduce(
      (sum, flat) =>
        sum + (parseInt(flat.count) || 0) * (parseInt(flat.sqft) || 0),
      0
    );

    if (totalArea === 0) return {};

    const ratePerSqFt = total / totalArea;

    const result: MaintenanceResult = {};
    flatTypes.forEach((flat) => {
      result[flat.id] = {
        name: flat.name,
        sqft: flat.sqft,
        maintenance: Math.round(ratePerSqFt * (parseInt(flat.sqft) || 0)),
        count: parseInt(flat.count) || 0,
      };
    });
    result.perSqFt = ratePerSqFt.toFixed(2);
    return result;
  };

  const calculateTotalCollection = (): number => {
    const maintenance = calculatePerFlatMaintenance();
    return flatTypes.reduce((sum, flat) => {
      const flatMaintenance = maintenance[flat.id]?.maintenance || 0;
      const count = parseInt(flat.count) || 0;
      return sum + flatMaintenance * count;
    }, 0);
  };

  const generateBill = (flatType: FlatType): void => {
    const maintenance = calculatePerFlatMaintenance();
    const flatMaintenance = maintenance[flatType.id];

    if (!flatMaintenance) return;

    const billContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 3px solid #4F46E5; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #4F46E5; margin: 0; }
        .info-section { margin-bottom: 30px; }
        .info-row { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #E5E7EB; }
        .info-row.header-row { background: #F3F4F6; font-weight: bold; }
        .expenses-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .expenses-table th, .expenses-table td { padding: 12px; text-align: left; border-bottom: 1px solid #E5E7EB; }
        .expenses-table th { background: #F3F4F6; font-weight: bold; }
        .total-section { background: #10B981; color: white; padding: 20px; border-radius: 8px; margin-top: 30px; }
        .total-section h2 { margin: 0 0 10px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center; color: #6B7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${societyData.societyName || 'Society Name'}</h1>
        <p>Monthly Maintenance Bill</p>
        <p>Date: ${new Date().toLocaleDateString('en-IN')}</p>
    </div>

    <div class="info-section">
        <div class="info-row header-row">
            <span>Flat Type</span>
            <span>${flatType.name}</span>
        </div>
        <div class="info-row">
            <span>Carpet Area</span>
            <span>${flatType.sqft} sq.ft</span>
        </div>
        <div class="info-row">
            <span>Rate per Sq.ft</span>
            <span>₹ ${maintenance.perSqFt}</span>
        </div>
    </div>

    <h3>Expense Breakdown</h3>
    <table class="expenses-table">
        <thead>
            <tr>
                <th>Expense Category</th>
                <th style="text-align: right;">Amount (₹)</th>
            </tr>
        </thead>
        <tbody>
            ${expenses
              .filter((e) => e.amount)
              .map(
                (expense) => `
                <tr>
                    <td>${expense.name}</td>
                    <td style="text-align: right;">₹ ${parseFloat(
                      expense.amount
                    ).toLocaleString('en-IN')}</td>
                </tr>
            `
              )
              .join('')}
            <tr style="font-weight: bold; background: #F3F4F6;">
                <td>Total Monthly Expense</td>
                <td style="text-align: right;">₹ ${calculateTotalExpense().toLocaleString(
                  'en-IN'
                )}</td>
            </tr>
        </tbody>
    </table>

    <div class="total-section">
        <h2>Monthly Maintenance Charge</h2>
        <h1 style="margin: 0; font-size: 36px;">₹ ${flatMaintenance.maintenance.toLocaleString(
          'en-IN'
        )}</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Calculated as per carpet area basis following Indian Society Bye-laws</p>
    </div>

    <div class="footer">
        <p>This is a computer-generated bill. For queries, please contact the society management.</p>
        <p>${
          societyData.societyName || 'Society Name'
        } | Maintenance Calculator</p>
    </div>
</body>
</html>
    `;

    const blob = new Blob([billContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${societyData.societyName || 'Society'}_${
      flatType.name
    }_Bill_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalExpense = calculateTotalExpense();
  const maintenance = calculatePerFlatMaintenance();
  const totalCollection = calculateTotalCollection();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-t-4 border-t-indigo-600 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Building2 className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-3xl">
                  Society Maintenance Calculator
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Calculate monthly maintenance as per Indian Society Bye-laws
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Society Details & Flat Types */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Society Details & Flat Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="societyName">Society Name</Label>
                <Input
                  id="societyName"
                  value={societyData.societyName}
                  onChange={(e) =>
                    setSocietyData({
                      ...societyData,
                      societyName: e.target.value,
                    })
                  }
                  placeholder="Enter society name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalFlats">Total Number of Flats</Label>
                <Input
                  id="totalFlats"
                  type="number"
                  value={societyData.totalFlats}
                  onChange={(e) =>
                    setSocietyData({
                      ...societyData,
                      totalFlats: e.target.value,
                    })
                  }
                  placeholder="Total flats"
                />
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Flat Types & Configuration
                </h3>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {flatTypes.map((flat) => (
                    <div
                      key={flat.id}
                      className="border rounded-lg p-3 bg-gray-50 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">
                          {flat.name}
                        </Label>
                        {flatTypes.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteFlatType(flat.id)}
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            type="number"
                            value={flat.count}
                            onChange={(e) =>
                              updateFlatType(flat.id, 'count', e.target.value)
                            }
                            placeholder="No. of flats"
                            className="text-sm"
                          />
                        </div>
                        <div className="relative">
                          <Input
                            type="number"
                            value={flat.sqft}
                            onChange={(e) =>
                              updateFlatType(flat.id, 'sqft', e.target.value)
                            }
                            placeholder="Sq.ft"
                            className="text-sm pr-12"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                            sq.ft
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Flat Type */}
                <div className="border-t pt-3 space-y-2">
                  <Label className="text-sm font-medium">
                    Add New Flat Type
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      value={newFlatType.name}
                      onChange={(e) =>
                        setNewFlatType({ ...newFlatType, name: e.target.value })
                      }
                      placeholder="e.g., 4 BHK"
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      value={newFlatType.sqft}
                      onChange={(e) =>
                        setNewFlatType({ ...newFlatType, sqft: e.target.value })
                      }
                      placeholder="Sq.ft"
                      className="text-sm"
                    />
                    <Button onClick={addFlatType} size="sm">
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Expenses */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-green-600" />
                Monthly Expenses (₹)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {expenses.map((expense) => {
                  const IconComponent = expense.icon;
                  return (
                    <div
                      key={expense.id}
                      className="flex gap-2 items-end group"
                    >
                      <div className="flex-1 space-y-2">
                        <Label className="text-sm flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-gray-600" />
                          {expense.name}
                        </Label>
                        <Input
                          type="number"
                          value={expense.amount}
                          onChange={(e) =>
                            updateExpenseAmount(expense.id, e.target.value)
                          }
                          placeholder="Enter amount"
                        />
                      </div>
                      {expenses.length > 5 && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteExpense(expense.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}

                {/* Add New Expense */}
                <div className="border-t pt-4 mt-4 space-y-3">
                  <Label className="text-sm font-medium">
                    Add Custom Expense
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newExpenseName}
                      onChange={(e) => setNewExpenseName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addExpense()}
                      placeholder="e.g., Pest Control, Generator"
                    />
                    <Button onClick={addExpense} className="shrink-0">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card className="shadow-2xl border-t-4 border-t-green-600 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calculator className="w-6 h-6 text-green-700" />
              Maintenance Calculation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-5 shadow-md border-l-4 border-l-blue-500">
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  Total Monthly Expense
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹ {totalExpense.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-md border-l-4 border-l-green-500">
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  Total Collection
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹ {totalCollection.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-500 mt-1">From all flats</p>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-md border-l-4 border-l-purple-500">
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  Rate per Sq.ft
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹ {maintenance.perSqFt || '0.00'}
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-md border-l-4 border-l-orange-500">
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  Total Flats
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {flatTypes.reduce(
                    (sum, flat) => sum + (parseInt(flat.count) || 0),
                    0
                  )}
                </p>
              </div>
            </div>

            {/* Individual Flat Type Maintenance */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Flat-wise Maintenance & Bills
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {flatTypes.map((flat) => {
                  const flatMaintenance = maintenance[flat.id];
                  if (!flatMaintenance) return null;

                  return (
                    <div
                      key={flat.id}
                      className="bg-white rounded-lg p-4 shadow-md border-t-2 border-t-indigo-500"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {flat.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {flat.sqft} sq.ft
                          </p>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {flat.count} flats
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-indigo-600 mb-3">
                        ₹ {flatMaintenance.maintenance.toLocaleString('en-IN')}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => generateBill(flat)}
                        >
                          <FileDown className="w-3 h-3 mr-1" />
                          Bill
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Total: ₹{' '}
                        {(
                          flatMaintenance.maintenance * flatMaintenance.count
                        ).toLocaleString('en-IN')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Note */}
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900 leading-relaxed">
              <strong className="font-semibold">Note:</strong> This calculator
              follows standard Indian Society Bye-laws where maintenance is
              calculated based on carpet area (square footage). The total
              expenses are distributed proportionally among all flats based on
              their respective areas. Click "Bill" to generate and download
              detailed maintenance bills for each flat type.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceCalculator;
