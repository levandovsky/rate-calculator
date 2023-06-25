import styles from "./App.module.scss";
import Select from "./components/Select";
import { useMergeState } from "./hooks/useMergeState";
import { CURRENCIES, Currency } from "./currencies";
import Field from "./components/Field";
import {
  ConverterData,
  ConverterParams,
  useConverter,
} from "./hooks/useConverter";
import Input from "./components/Input";
import { classnames } from "./utils/classnames";
import SvgReverseIcon from "./assets/reverse.svg";
import { shallowEqual } from "./utils/compareObject";
import { useDebounce } from "./hooks/useDebounce";

const currencyList = Object.keys(CURRENCIES) as Currency[];

const optionFormat = (option: Currency) => `${CURRENCIES[option]} ${option}`;

type State = {
  firstCalculated: boolean;
  convertedTo?: number;
  converterData?: ConverterData;
};

type UpdateConverterParams = {
  update: Partial<ConverterParams>;
  debounce?: boolean;
};

function App() {
  const [state, setState] = useMergeState<State>({
    firstCalculated: false,
  });

  const [params, setParams] = useMergeState<ConverterParams>({
    from: "EUR",
    to: "GBP",
    amount: 1,
  });

  const amountValid = params.amount > 0;
  const convertedToValid =
    state.convertedTo === undefined || state.convertedTo > 0;

  const { calculateRates, isLoading, error } = useConverter();

  const debouncedCalculateRates = useDebounce(calculateRates, 500);

  const currenciesFrom = currencyList.filter(
    (currency) => currency !== params.to
  );

  const currenciesTo = currencyList.filter(
    (currency) => currency !== params.from
  );

  const updateConverterData = async ({
    update,
    debounce = false,
  }: UpdateConverterParams) => {
    const newParams: ConverterParams = {
      ...params,
      ...update,
    };

    const isEqual = shallowEqual(params, newParams);

    if (isEqual) return;

    setParams(newParams);

    if (!state.firstCalculated || newParams.amount <= 0) return;

    const handler = debounce ? debouncedCalculateRates : calculateRates;

    const result = await handler(newParams);

    if (result instanceof Error) return;

    setState({
      convertedTo: result.toAmount,
      converterData: result,
    });
  };

  const updateConvertedTo = async (value: number) => {
    if (value === state.convertedTo) return;

    const newParams: ConverterParams = {
      from: params.to,
      to: params.from,
      amount: value,
    };

    setState({
      convertedTo: value,
    });

    if (value <= 0) return;

    const result = await debouncedCalculateRates(newParams);

    if (result instanceof Error) return;

    setParams({
      amount: result.toAmount,
    });
  };

  return (
    <main className={styles.app}>
      <form
        className={styles.calculator}
        onSubmit={async (e) => {
          e.preventDefault();

          if (!amountValid) return;

          const result = await calculateRates(params);

          if (result instanceof Error) return;

          setState({
            convertedTo: result.toAmount,
            converterData: result,
            firstCalculated: true,
          });
        }}
      >
        <div className={styles.currencies}>
          <Field name="from" label="FROM">
            <Select
              name="from"
              value={params.from}
              options={currenciesFrom}
              onChange={(value) => {
                updateConverterData({
                  update: {
                    from: value,
                  },
                });
              }}
              formatOption={optionFormat}
              disabled={isLoading}
            />
          </Field>
          <button
            type="button"
            className={styles.reverseButton}
            disabled={!params.to || !params.from || isLoading}
            onClick={() => {
              updateConverterData({
                update: {
                  from: params.to,
                  to: params.from,
                },
              });
            }}
          >
            <SvgReverseIcon />
          </button>
          <Field name="to" label="TO">
            <Select
              name="to"
              value={params.to}
              options={currenciesTo}
              onChange={(value) => {
                updateConverterData({
                  update: {
                    to: value,
                  },
                });
              }}
              formatOption={optionFormat}
              disabled={isLoading}
            />
          </Field>
        </div>
        <div className={styles.amountContainer}>
          <Field
            name="amount"
            label="AMOUNT"
            errors={!amountValid ? ["Amount should be greater than 0"] : []}
          >
            <Input
              name="amount"
              type="number"
              value={params.amount}
              onChange={(value) => {
                updateConverterData({
                  update: {
                    amount: value,
                  },
                  debounce: true,
                });
              }}
            />
          </Field>
          {state.convertedTo !== undefined && (
            <Field
              name="converted"
              label="CONVERTED TO"
              errors={
                !convertedToValid ? ["Amount should be greater than 0"] : []
              }
            >
              <Input
                name="converted"
                type="number"
                value={state.convertedTo || 0}
                onChange={updateConvertedTo}
              />
            </Field>
          )}
        </div>
        {state.converterData && (
          <div className={styles.rateContainer}>
            <div className={styles.rate}>
              1 {params.from} = {state.converterData.rate} {params.to}
            </div>
            <p className={styles.info}>
              All figures are live mid-market rates, which are for informational
              purposes only. To see the rates we quote for money transfer,
              please select Live Money Transfer Rates.
            </p>
          </div>
        )}
        {!state.firstCalculated && (
          <button
            disabled={!amountValid}
            className={classnames(styles.convertButton, {
              [styles.loading]: isLoading,
            })}
            type="submit"
          >
            Convert
          </button>
        )}
        {error && <div className={styles.error}>{error}</div>}
      </form>
    </main>
  );
}

export default App;
