import AppClient from '../httpClients/appClient';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { ItemSimple, UserItemsReq, UserItemsRes } from '../types/appApiTypes';
import { AppResponseError } from '../errors/AppResponseError';
import { TimelineItem } from '../dataObjects/item';
import { NotFoundError } from '../errors/NotFoundError';
import { FormErrorState } from '../reducers/formErrorReducer';

export const FETCH_USER_ITEMS_START = 'FETCH_USER_ITEMS_START';
export const FETCH_USER_ITEMS_SUCCESS = 'FETCH_USER_ITEMS_SUCCESS';
export const FETCH_USER_ITEMS_FAIL = 'FETCH_USER_ITEMS_FAIL';

type Actions =
  | FetchUserItemsStartAction
  | FetchUserItemsSuccessAction
  | FetchUserItemsFailAction;
type ThunkResult<R> = ThunkAction<R, void, undefined, Actions>;

export function fetchUserItemsAction(
  userId: number,
  itemId?: number,
  createdAt?: number,
): ThunkResult<void> {
  return (dispatch: ThunkDispatch<any, any, Actions>) => {
    Promise.resolve(() => {
      dispatch(fetchUserItemsStartAction());
    })
      .then(() => {
        return AppClient.get(`/users/${userId}.json`, {
          item_id: itemId,
          created_at: createdAt,
        } as UserItemsReq);
      })
      .then((response: Response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new NotFoundError('UserItems not found');
          }

          throw new AppResponseError(
            'Request for getting transaction list data was failed',
            response,
          );
        }

        return response.json();
      })
      .then((body: UserItemsRes) => {
        dispatch(
          fetchUserItemsSuccessAction({
            items: body.items.map((item: ItemSimple) => ({
              id: item.id,
              status: item.status,
              name: item.name,
              price: item.price,
              thumbnailUrl: item.image_url,
              createdAt: item.created_at,
            })),
            hasNext: body.has_next,
          }),
        );
      })
      .catch((err: Error) => {
        dispatch(
          fetchUserItemsFailAction({
            error: err.message,
          }),
        );
      });
  };
}

export interface FetchUserItemsStartAction
  extends Action<typeof FETCH_USER_ITEMS_START> {}

const fetchUserItemsStartAction = (): FetchUserItemsStartAction => {
  return {
    type: FETCH_USER_ITEMS_START,
  };
};

export interface FetchUserItemsSuccessAction
  extends Action<typeof FETCH_USER_ITEMS_SUCCESS> {
  payload: {
    items: TimelineItem[];
    hasNext: boolean;
  };
}

const fetchUserItemsSuccessAction = (payload: {
  items: TimelineItem[];
  hasNext: boolean;
}): FetchUserItemsSuccessAction => {
  return {
    type: FETCH_USER_ITEMS_SUCCESS,
    payload,
  };
};

export interface FetchUserItemsFailAction
  extends Action<typeof FETCH_USER_ITEMS_FAIL> {
  payload: FormErrorState;
}

const fetchUserItemsFailAction = (
  newError: FormErrorState,
): FetchUserItemsFailAction => {
  return {
    type: FETCH_USER_ITEMS_FAIL,
    payload: newError,
  };
};
